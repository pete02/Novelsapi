const fs = require('fs');
const express=require('express')
const cors=require('cors')
const spawn=require('child_process').spawn;
const {getarticles,getbook,formjson, modify,owned,del, update}=require('./bookcode/books');
const { Console } = require('console');
const app=express()
const rinlist=require('./test2')
const port="3001"
let status="idle"

app.use(express.json())
app.use(cors())
app.use(express.static("./frontend/build"))

//downloads the book
app.post("/api/get",async (req,res)=>{
	status="processing"
	console.log(req.body.link)
	//e= await rinlist(req.body.link)
	//console.log(e)
	status="idle"
	res.send("done")
})
//get all json of vbooksc
app.get("/api/json",async (req,res)=>{

	res.json(JSON.parse(fs.readFileSync("./db/db.json")))
})

//find books on a given series
app.get("/api/status",async (req,res)=>{
	res.send(status)
})

app.post("/api/series",async (req,res)=>{
	status="processing"
	console.log(req.body)
	let book=formjson(req.body.book)
	status="idle"
	res.send(book)
})
	
app.get("/api/update/",async (req,res)=>{
	status="updating"
	console.log("start update")
	res.send(await update())
	console.log("finish")
	status="idle"
})

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

app.post("/api/modify",async(req,res)=>{
	status="processing"
	let db=modify(req.body.i,req.body.book)
	status="idle"
	res.send(db)
})
//find link for different series, to be chosen later
app.post("/api/findseries",async (req,res)=>{
	status="processing"
	console.log(req.body.book)
	res.send(await getarticles(req.body.book))
	status="idle"
})


app.listen(port,'0.0.0.0',() => {
    console.log(`started on port ${port}`)
})

