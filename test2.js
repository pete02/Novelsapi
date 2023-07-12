import { response } from 'express'
import {JSDOM} from 'jsdom'
import fetch from 'node-fetch'
import { File } from 'megajs'
import fs from 'fs'
import { exec } from 'child_process'

//gets series, internal
async function getSeries(link){
	console.log(link)
  return(JSDOM.fromURL(link).then(async data=>{
    let dom=data.window.document
	let book=getInfo(dom)
	book.books=await getVolumes(dom)
	return book
  }))
}
//gets info, internal
function getInfo(dom){
	let sum=Array.from(dom.querySelector("details").querySelectorAll("p")).map(a=>a.innerHTML).join("\n")
	let title=dom.querySelector(`[class*="post-title entry-title"]`).querySelector('a').innerHTML
	let pic=dom.querySelector(`[class*="featured-media"]`).querySelector("img").getAttribute("src")
	return {title:title,sum:sum,pic:pic}
}
//gets the megalink for the book, internal
async function getLink(link){
	return(fetch(link).then(response=>{
		return(JSDOM.fromURL(`https://linkbypasser.net/?url=${response.url}`).then(data=>{
			let dom=data.window.document
			let link=Array.from(dom.getElementById("result").getElementsByTagName("a"))[0]
			return link.getAttribute("href")
		}))
	}))
}
//gets the links to the volumes, internal
async function getVolumes(dom){
	let links=Array.from(dom.getElementsByClassName("post-content clear")[0].getElementsByTagName("a"))
	links=links.filter(l=>l.textContent.includes("Vol"))
	links=links.map(l=>{return {link:l.getAttribute("href"),name:l.textContent}})
	links=await Promise.all(links.map(async l=>{return {name:l.name,link:await getLink(l.link)}}))
	return links
}

//searches for a series, external
export async function searchSeries(a){
	return (JSDOM.fromURL(`https://thatnovelcorner.com/?s=${a.replace(" ","+")}`).then(async data=>{
		console.log("dealing")
		let dom=data.window.document
		let posts=Array.from(dom.getElementById("posts").querySelectorAll("article"))
		console.log(posts.length)
		posts=posts.map(post=>post.querySelector("a").getAttribute("href").split("-vol")[0])
		posts=posts.map(post=>(post.slice(-1)=="/")?post.slice(0,-1):post)
		posts=posts.filter((e,i)=>posts.indexOf(e)==i)
		posts=await Promise.all(posts.map(async p=>await getSeries(p)))
		return posts

	}).catch((e)=>{
		console.log(e)
		console.log("error in getting")
		return null
	}))
}

//downloads mega link, external
export async function download(link){
	const file=File.fromURL(link)
	const data = await file.downloadBuffer()
	const path="zip/test.zip"
	await new Promise((resolve,reject)=>{
		fs.writeFile(path,data,(error)=>{
			if(error){
				reject(error)
			}else{
				exec(`unzip -P thatnovelcorner.com zip/* -d books`, console.log("unzipped"))
				resolve()
			}
		})
	})
	fs.unlinkSync(path)
}


//getSeries("https://thatnovelcorner.com/baccano").then(a=>console.log("done"))
//download('https://mega.nz/file/V3A22RIY#AAAAAAAAAAAC18qPn06iZQAAAAAAAAAAAtfKj59OomU').then(a=>console.log("done"))
