const {isKanji,hasKanji} =require('./kanji')
const fs=require('fs')
const axios = require('axios');
const {JSDOM}=require('jsdom');
const { post } = require('jquery');
const { createBrotliDecompress } = require('zlib');
const e = require('express');

// python code
function getbook(url){
	const pyprocess=spawn('python',["./test.py",url])
	pyprocess.stdout.on('data', (data) => {
		console.log("data:"+data.toString())
	});
}



async function check(url){
	let data=await JSDOM.fromURL(`https://thatnovelcorner.com/${url}`)

	let dom=data.window.document
	let book
	let test=dom.querySelector("details")
	let test2= dom.querySelector("[class*='post-content clear']").querySelector("p").querySelector("a")
	if(test){
		
		let links=dom.querySelector(`[class*="post-content clear"]`).innerHTML.split("<br>")
		let pic=dom.querySelector(`[class*="featured-media"]`).querySelector("img").getAttribute("src")
		links=links.filter(a=>a.includes("(Mirror)"))
		links=links.map(a=>(a.match(/(?<=\<a\shref=.*?\>).*?(?=\<\/a\>)/g)))
		let title=dom.querySelector(`[class*="post-title entry-title"]`).querySelector('a').innerHTML
		let sum=Array.from(dom.querySelector("details").querySelectorAll("p")).map(a=>a.innerHTML).join("\n")
		book={"books":links,"link":url.replace("/",""),"title":title,"serarch":[url,url.replaceAll("-"," ")],"pic":pic,"summary":sum}
		book.books=links.map(a=>{return {"book":a[0].replace(" Premium",""),"link":a[1].match(/href="(.*?)"/g)[0].replace("href=","")}})
	}else if(test2 && test2.innerHTML=="LN information"){
		
		let links=dom.querySelector(`[class*="post-content clear"]`).innerHTML.split("<br>")
		let pic=dom.querySelector(`[class*="featured-media"]`).querySelector("img").getAttribute("src")
		links=links.filter(a=>a.includes("(Mirror)") ||a.includes("(M)"))
		links=links.map(a=>(a.match(/(?<=\<a\shref=.*?\>).*?(?=\<\/a\>)/g)))
		let title=dom.querySelector(`[class*="post-title entry-title"]`).querySelector('a').innerHTML
		book={"books":links,"link":url.replace("/",""),"title":title,"serarch":[url,url.replaceAll("-"," ")],"pic":pic,"summary":""}
		book.books=links.map(a=>{return {"book":a[0].replace(" Premium",""),"link":a[1].match(/href="(.*?)"/g)[0].replace("href=","")}})
	} else{
		let links=dom.querySelector(`[class*="post-content clear"]`).querySelectorAll("a")
		for(let link of links){
			if(link.innerHTML==="Refer to series page for latest links"){
				book=check(link.getAttribute("href").replace("https://thatnovelcorner.com/",""))
			}
			
		}
	}

	return book
	
}

async function recheck(a){
	let newbook=await check(a.link)
	let oldbooks=a.books
	let newbooks=newbook.books

	oldbooks=oldbooks.map(ob=>{
		for(nb of newbooks){
			if(ob.book===nb.book){
				ob.link=nb.link
				newbooks.splice(newbooks.indexOf(nb),1)
				break
			}
		}
		return ob
	})
	if(newbooks&&newbooks.length>0){

		oldbooks.push(...newbooks.map(a=>{
			a.owned=false
			return a
		}))
	}
	a.books=oldbooks
	return a
	}


async function update(){
	let db=JSON.parse(fs.readFileSync("./db/db.json"))
	db.map(a=>recheck(a))
	fs.writeFileSync("./db/db.json",JSON.stringify(db))
}

async function getarticles(a){
	return (JSDOM.fromURL(`https://thatnovelcorner.com/?s=${a.replace(" ","+")}`).then(async data=>{
		console.log("dealing")
		let dom=data.window.document
		let posts=Array.from(dom.getElementById("posts").querySelectorAll("article"))
		console.log(posts.length)
		posts=posts.map(post=>post.querySelector("a").getAttribute("href").split("-vol")[0])
		posts=posts.map(post=>(post.slice(-1)=="/")?post.slice(0,-1):post)
		posts=posts.filter((e,i)=>posts.indexOf(e)==i)
		posts=posts.map(post=>post.replace("https://thatnovelcorner.com/",""))
		posts=posts.map(async p=>check(p))
		posts= await Promise.all(posts)
		
		posts=posts.filter(a=>a)
		posts.map(a=>console.log(a))
		posts=posts.filter((a,i)=>posts.indexOf(posts.find(b=>b.title==a.title))==i)

		return posts

	}).catch((e)=>{
		console.log(e)
		console.log("error in getting")
		return null
	}))
}

async function modify(i,a){
	let db=await JSON.parse(fs.readFileSync("./db/db.json"))
	console.log(typeof(a.search))
	db[i].title=(typeof(a.title)==="undefined")? db[i].title : a.title
	db[i].serarch=(typeof(a.search)==="undefined")? db[i].search : a.search
	db[i].link=(typeof(a.link)==="undefined")? db[i].link : a.link
	db[i].pic=(typeof(a.pic)==="undefined")? db[i].pic : a.pic
	fs.writeFileSync("./db/db.json",JSON.stringify(db))
	return db[i]
}


async function del(i){
	let db=await JSON.parse(fs.readFileSync("./db/db.json"))
	db.splice(i,1)
	for(i=0;i<db.length;i++){
		db[i].index=(db[i].index>i)?db[i].index-1:db[i].index
	}
	fs.writeFileSync("./db/db.json",JSON.stringify(db))

}

async function owned(i,b,o){
	console.log("b:")
	console.log(b)
	let db=await JSON.parse(fs.readFileSync("./db/db.json"))
	if(db[i]&&db[i].books[b]){
		db[i].books[b].owned=o
	}
	
	fs.writeFileSync("./db/db.json",JSON.stringify(db))
}
async function formjson(a){
	let db=await JSON.parse(fs.readFileSync("./db/db.json"))
	a.index=db.length
	console.log(a)
	db.push(a)
	fs.writeFileSync("./db/db.json",JSON.stringify(db))
	return a
}

module.exports= {getbook,getarticles,formjson,modify,owned,del,update}