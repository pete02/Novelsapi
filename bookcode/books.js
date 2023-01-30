const {isKanji,hasKanji} =require('./kanji')
const fs=require('fs')
const axios = require('axios');
const {JSDOM}=require('jsdom');
const { post } = require('jquery');

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
		links=links.filter(a=>a.includes("(Mirror)"))
		links=links.map(a=>(a.match(/(?<=\<a\shref=.*?\>).*?(?=\<\/a\>)/g)))
		book.books=links.map(a=>{return {"book":a[0].replace(" Premium",""),"link":a[1].match(/href="(.*?)"/g)[0].replace("href=","")}})
		return book
	}))
}

async function getarticles(a){
	return (JSDOM.fromURL(`https://thatnovelcorner.com/?s=${a.replace(" ","+")}`).then(async data=>{
		let dom=data.window.document
		let posts=Array.from(dom.getElementById("posts").querySelectorAll("article"))
		posts=posts.map(post=>post.querySelector("a").getAttribute("href").split("-vol")[0])
		posts=posts.map(post=>(post.slice(-1)=="/")?post.slice(0,-1):post)
		posts=posts.filter((e,i)=>posts.indexOf(e)==i)
		posts=posts.map(post=>post.replace("https://thatnovelcorner.com/",""))
		console.log(posts)
		
		return posts

	}).catch(()=>{
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
	console.log(a)
	let db=JSON.parse(fs.readFileSync("./db.json"))
	let book=db.filter(book=>book.link && book.link.includes(a))
	if(book.length==0){
		book={"title":"","search":[a,a.replaceAll("-"," ")],"books":[],"index":db.length,"link":`https://thatnovelcorner.com/${a.replace(" ","+")}`,"pic":""}
		book=await getbooks(book)
		db.push(book)
	}else{
		book=book[0]
		book=await getbooks(book)
		console.log(book)
		
	}

	fs.writeFileSync("./db.json",JSON.stringify(db))
	return book
}

module.exports= {getbook,getarticles,formjson,modify}