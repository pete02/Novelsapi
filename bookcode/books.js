const {isKanji,hasKanji} =require('./kanji')
const fs=require('fs')
const axios = require('axios');
const {JSDOM}=require('jsdom');
const { post } = require('jquery');
const { createBrotliDecompress } = require('zlib');

// python code
function getbook(url){
	const pyprocess=spawn('python',["./test.py",url])
	pyprocess.stdout.on('data', (data) => {
		console.log("data:"+data.toString())
	});
}

async function getoriginal(a){
	let data=await JSDOM.fromURL(a)
	let dom=data.window.document
	let original=dom.querySelector(`[class*="post-content clear"]`).querySelector("a")
	if(original.innerHTML=="Refer to original post"||original.innerHTML=="Refer to series page for latest links"){
		return original.getAttribute("href")
	}
	return
}

function getbooks(book){
	return(JSDOM.fromURL(book.link).then(data=>{
		let dom=data.window.document
		console.log(book.title.length)
		if(book.title==''){
			book.title=dom.querySelector(`[class*="post-title entry-title"]`).querySelector('a').innerHTML
		}
		let links=dom.querySelector(`[class*="post-content clear"]`).innerHTML.split("<br>")
		book.pic=dom.querySelector(`[class*="featured-media"]`).querySelector("img").getAttribute("src")
		let sum=Array.from(dom.querySelector("details").querySelectorAll("p")).map(a=>a.innerHTML).join("\n")
		links=links.filter(a=>a.includes("(Mirror)"))
		links=links.map(a=>(a.match(/(?<=\<a\shref=.*?\>).*?(?=\<\/a\>)/g)))
		book.summary=sum
		book.books=links.map(a=>{return {"book":a[0].replace(" Premium",""),"link":a[1].match(/href="(.*?)"/g)[0].replace("href=","")}})
		return book
	}))
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

function modify(i,a){
	let db=JSON.parse(fs.readFileSync("db.json"))
	console.log(typeof(a.search))
	db[i].title=(typeof(a.title)==="undefined")? db[i].title : a.title
	db[i].search=(typeof(a.search)==="undefined")? db[i].search : a.search
	db[i].link=(typeof(a.link)==="undefined")? db[i].link : a.link
	db[i].pic=(typeof(a.pic)==="undefined")? db[i].link : a.pic
	fs.writeFileSync("db.json",JSON.stringify(db))
	return db[i]
}

async function formjson(a){
	let db=JSON.parse(fs.readFileSync("./db.json"))
	a.index=db.length
	db.push(a)
	fs.writeFileSync("./db.json",JSON.stringify(db))
	return a
}

module.exports= {getbook,getarticles,formjson,modify}