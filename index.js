

const fs = require('fs');
const express=require('express')
const cors=require('cors')
const spawn=require('child_process').spawn;
const {updateall,getbook,handlebook}=require('./bookcode/books')
const app=express()

app.use(express.json())
app.use(cors())



app.get("/api/book",async (req,res)=>{
	getbook(req.body.link)
	res.send("getting")
})

app.get("/api/json",async (req,res)=>{
	res.json(JSON.parse(fs.readFileSync("./db.json")))
})

app.get("/api",async (req,res)=>{
	updateall()
	res.send("updating")
})




app.post("/api/getbook",async (req,res)=>{
	handlebook(req.body.book).then(a=>{
		res.json(a)})
})

app.listen('3001','0.0.0.0',() => {
    console.log("started")
})

