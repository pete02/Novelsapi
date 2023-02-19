const csv=require('csvtojson')
series=[]
const book="Volume 4"

async function test(){
    let books=await csv().fromFile("./test.csv");
    books=books.filter(a=>a.title.toLowerCase().includes("sword art online progressive"))
    console.log(books)
    console.log(books.find(a=>a.title.split("Vol. ")[1]==book.replace("Volume ","")))
}

test()
