import fs from 'fs'
import cors from 'cors'
import {spawn} from 'child_process'
import { Console } from 'console';
import express from 'express'

//import {getarticles,getbook,formjson, modify,owned,del, update} from './bookcode/books';

import { owned, readData, writeData } from './bookcode/db.js';
import {searchSeries} from './bookcode/books.js'

const app=express()
const port="3001"
let status="idle"

let added=false

app.use(express.json())
app.use(cors())
app.use(express.static("./frontend/build"))

//needs work
app.post("/api/get",async (req,res)=>{
	status="processing"
	console.log(req.body.link)
	//e= await rinlist(req.body.link)
	status="idle"
	res.send("done")
})
//works
app.get("/api/status",async (req,res)=>{
	res.send(status)
})


//needs work
app.get("/api/update/",async (req,res)=>{
	status="updating"
	console.log("start update")
	//res.send(await update())
	console.log("finish")
	status="idle"
})
//needs work
app.post("/api/delete",async(req,res)=>{
	status="processing"
	del(req.body.i)
	status="idle"
	res.send("done")
})

app.post("/api/owned",async (req,res)=>{
	console.log(req.body)
	status="processing"
	owned(req.body.series,req.body.book,req.body.owned)
	status="idle"
	res.send("done")
})


//needs woek
app.post("/api/modify",async(req,res)=>{
	status="processing"
	//let db=modify(req.body.i,req.body.book)
	status="idle"
	//res.send(db)
})

//works
app.post("/api/save",async (req,res)=>{
	status="processing"
	console.log(req.body)
	writeData(req.body.book)
	added=true
	status="idle"
	res.send("done")
})
//works
app.get("/api/json",async (req,res)=>{
	added=false
	console.log("requested")
	res.json(await readData())
})


//works
app.get("/api/search",async (req,res)=>{
	status="processing"
	console.log(req.query.s)
	if(req.query.s&&req.query.s.length>0){
		res.send(await searchSeries(req.query.s))

	}else{
		res.send("no book")
	}
	status="idle"
})


app.listen(port,'0.0.0.0',() => {
    console.log(`started on port ${port}`)
})

