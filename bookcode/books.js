const {isKanji,hasKanji} =require('./kanji')
const fs=require('fs')
const axios = require('axios');
const {JSDOM}=require('jsdom')

// get the original post based on the book name
async function get_original(name){
	console.log("get original")
	const res=await axios.get(`https://jnovels.com/?s=${name.replace(" ","+")}`, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } })
	const dom=new JSDOM(res.data).window.document
	const articlelist=dom.querySelectorAll("article")
	let list=[]
	articlelist.forEach(element => {
		try{
			list.push(element.querySelectorAll("div")[1].querySelector("p").querySelector("a").getAttribute("href"))
		}catch{
			//console.log("no original post")
		}
		
	});
	let set=[...new Set(list)]
	set=set.filter(e=>e.includes("epub"))
	return set
}

// python code
function getbook(url){
	const pyprocess=spawn('python',["./test.py",url])
	pyprocess.stdout.on('data', (data) => {
		console.log("data:"+data.toString())
	});
}

//construct a book
function list(href,olink){
	let bl=[]
	let i=0
	let bookl=[]
	let masterbl=[]
	let num=0
	href.map(l=>{
		i++
		const child=l.querySelector("a")
		let name=l.textContent.replace("Download","").replace("download","").replace("DOWNLOAD","").replace(child.innerHTML,"") + child.innerHTML.replace("Download","").replace("download","").replace("DOWNLOAD","")
		while(name.includes("<")&&name.includes(">")){
			name=name.replace(/<*>/, '')
		}

		if(!name){
			name=child.innerHTML.replace("Download","").replace("download","").replace("DOWNLOAD","")
		}
		
		name=name.replaceAll("—","")
		let nl=[]
		let n=name.matchAll(/\d/g)
		for(e of n){
			nl.push(e.index)
		}

		if(nl.length>0){
			name=name.substring(0,nl.at(-1)+1)
		}else{
			name="volume "+i.toString()
		}

		if(!name || name==""){
			name="volume "+i.toString()
		}
		let link=child.getAttribute("href")

		if(link&&!link.includes("discord") && !link.includes("jnovels") && !link.includes("google") && !link.includes("wiki") && link.length>1){
			if(bookl.find(a=>a.name===name)){
				if(bookl.find(a=>a.link===link)){

				}else{
					masterbl.push({"subtitle":bookl[0].name,"id":olink,"list":bookl})
					i=1
					num=0
					bookl=[]
					bookl.push({"id":num,"name":name,"link":link,"owned":false})
				}
			}else{
				bookl.push({"id":num,"name":name,"link":link,"owned":false})	
			}
			num++
		}
		
		
	})
	bookl=bookl.filter(a=>!(a===null))
	if(bookl.length>0){
		console.log("book")
		masterbl.push({"subtitle":bookl[0].name,"id":olink,"list":bookl})
		console.log(masterbl)
		return masterbl
	}
	else return null
		
}

//construct books in a series
function links(dom,dbp,link){
	let i=0
	let articles=dom.getElementsByTagName("article")
	let article=Array.prototype.slice.call(articles).filter(a=>a.getAttribute("id").includes("post"))[0]
    let href=Array.prototype.slice.call(article.getElementsByClassName("post-content clear")[0].querySelectorAll("a"))
    href=href.filter(a=>a.getAttribute("href")!==null && !a.getAttribute("href").includes("jnovels.com")&&!a.getAttribute("href").includes("google.com") && !a.getAttribute("href").includes("discord") && a.getAttribute("rel")==null &&(a.getAttribute("class")==null|| a.getAttribute("class").includes("external")))
    href=href.filter(a=>a.getAttribute("href")!==a.innerHTML)
    let href2=[]
    if(href.length>1){
        let parent=href[0].parentElement
        let a=true
        while(parent.childElementCount==1|| a){
            parent=parent.parentElement
            a=false
            for(n of parent.childNodes){
                if(n.nodeName==="a"){
                    a=true
                }
            }
        }
        let test=parent.parentElement
        if(test.getAttribute("class")=="post-content clear"){
            if(parent.nodeName!=="div"){
                
                for(a of test.querySelectorAll(parent.nodeName)){
                    href2.push([...Array.prototype.slice.call(a.querySelectorAll("a"))])
                }

            }else{
                href2.push(Array.prototype.slice.call(parent.querySelectorAll("a")))
            }
            
        }else{
            href2.push(Array.prototype.slice.call(test.querySelectorAll("a")))
        }
        
    }
    href=href2.map(a=>a.map(a=>a.parentElement))
    let divs=article.getElementsByTagName("div")
    let divimg=Array.prototype.slice.call(divs).filter(a=>a.getAttribute("class")!=null&&a.getAttribute("class").includes("featured-media"))[0]
    dbp.img=divimg.getElementsByTagName("img")[0].getAttribute("src")
    let masterbl=[]
    href.map(a=>{
        let l=list(a,link)
		if(l!==null){
			console.log("l")
			console.log(l)
			masterbl.push(...l)
		}
    })
	i=0
	let k
	dbp.booklist=masterbl
    return dbp
}



//get list of books form original post
async function getbooklist(link,search,d){
	console.log(link)
	let dbp={}
	if(d.list==null){
		dbp=d
	}else{
		dbp={"title":null,"link":null,"search":[],"img":null,"booklist":[],"number":""}
	}
	if(link){

		let res=await axios.get(link,{maxRedirects:10, headers:{Accept: 'application/json', 'Accept-Encoding': 'identity' ,params: { trophies: true }}} )
		const dom=new JSDOM(res.data).window.document
		
		dbp=links(dom,dbp,link)
		
		let title=dom.getElementById("editassociated")
		if(title){
			title=title.innerHTML.split("<br>").filter(a=>!hasKanji(a)).map(a=>a.replace("\n",""))
			console.log(title)
			dbp.title=title
		}else{
			dbp.title=[]
		}

		dbp.link=link
		if(!dbp.search.includes(search)&& dbp.search!==""){
			dbp.search.push(search)
		}


		console.log(dbp)
		return dbp
	}else{
		return null
	}
	
	
}

//handle a book
async function handlebook(a){
	let db=JSON.parse(fs.readFileSync('./db.json'))
	let book=[]
	if(db.list.length>0){
		book=db.list.filter(d=>d.search.includes(a))
	}
	if(book.length==0){
		let r=await get_original(a)
		r=r[0]
		let dbp=await getbooklist(r,a,db)
		if(dbp){
			let l=db.list.filter(a=>a.link==dbp.link)[0]
			console.log[l]
			if(l){
				let i=db.list.indexOf(l)
				console.log(i)
				dbp.search=db.list[i].search.concat(dbp.search)
				db.list[i]=dbp
				
				console.log(db.list[i])
				fs.writeFileSync("./db.json",JSON.stringify(db))
				return dbp
			}else{
				db.list.push(dbp)
				
				fs.writeFileSync("./db.json",JSON.stringify(db))
				return dbp
			}
		}
			
	}else{
		console.log("book:1")
		console.log(book)
		book=book[0]
		let dbp=await getbooklist(book.link,a,book)
		if(dbp.link){
			let i=db.list.indexOf(book)
			db.list[i]=dbp
			fs.writeFileSync("./db.json",JSON.stringify(db))
			return dbp
		
		}
	}
}
//update all books
async function updateall(){
	let db=JSON.parse(fs.readFileSync("./db.json"))
	let books=db.list
	console.log(books)
	books.map(book=>{
		getbooklist(book.link,"",book).then(dbp=>{
			if(dbp.link){
				let i=db.list.indexOf(book)
				db.list[i]=dbp
				fs.writeFileSync("./db.json",JSON.stringify(db))
				return dbp
			
			}})
	})

}

module.exports={updateall,getbook,handlebook}