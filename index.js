const fs = require('fs');
const express=require('express')
const cors=require('cors')
const spawn=require('child_process').spawn;
const {getarticles,getbook,formjson, modify,owned,del}=require('./bookcode/books');
const { Console } = require('console');
const app=express()
const run=require('./test2')
const port="3001"


app.use(express.json())
app.use(cors())
app.use(express.static("./frontend/build"))

//downloads the book
app.post("/api/get",async (req,res)=>{
	console.log(req.body.link)
	run(req.body.link,"/usr/bin/brave-browser")
	res.send("getting")
})
//get all json of vbooks
app.get("/api/json",async (req,res)=>{
	res.json(JSON.parse(fs.readFileSync("./db/db.json")))
})
//updates all books
/*
app.get("/api",async (req,res)=>{
	updateall()
	res.send("updating")
})
*/
//find books on a given series
app.post("/api/series",async (req,res)=>{
	console.log(req.body)
	let book=formjson(req.body.book)
	res.send(book)
})
	

app.post("/api/delete",async(req,res)=>{
	del(req.body.i)
	res.send("done")
})

app.post("/api/owned",async (req,res)=>{
	owned(req.body.series,req.body.book,req.body.owned)
	res.send("done")
})

app.post("/api/modify",async(req,res)=>{
	let db=modify(req.body.i,req.body.book)
	res.send(db)
})
//find link for different series, to be chosen later
app.post("/api/findseries",async (req,res)=>{
	console.log(req.body.book)
	res.send(await getarticles(req.body.book))
})


app.listen(port,'0.0.0.0',() => {
    console.log(`started on port ${port}`)
})

