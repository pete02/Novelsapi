const fs = require('fs');
const express=require('express')
const cors=require('cors')
const spawn=require('child_process').spawn;
const {getarticles,getbook,formjson, modify}=require('./bookcode/books');
const { Console } = require('console');
const app=express()
const port="3001"


app.use(express.json())
app.use(cors())


//downloads the book
app.get("/api/get",async (req,res)=>{
	getbook(req.body.link)
	res.send("getting")
})
//get all json of vbooks
app.get("/api/json",async (req,res)=>{
	res.json(JSON.parse(fs.readFileSync("./db.json")))
})
//updates all books
/*
app.get("/api",async (req,res)=>{
	updateall()
	res.send("updating")
})
*/
//find books on a given series
app.get("/api/series",async (req,res)=>{
	let book=formjson(req.body)
	res.send(book)
})
	

app.get("/api/modify",async(req,res)=>{
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

