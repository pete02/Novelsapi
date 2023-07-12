import { InfluxDB } from "influx";

// Define the InfluxDB configuration
const influx = new InfluxDB({
  host: '192.168.0.100',
  database: 'booksdb',
  port:8086
});

export function writeData(book){
    let string=JSON.stringify(book)
    influx.writePoints([   
        {     
            measurement: 'books',
            tags:{title:book.title},     
            fields: {data: string}   
        } ])
        .then(() => {   
        console.log('Added data to the Db');
             
        }).catch(e=>console.log(e));
}

export function readData(){
    return influx.query("select * from books").then(data=>{
        console.log(data)
        let books=data.map(a=>JSON.parse(a.data))
        return books
    })
}

export function owned(title,book,owned){
    console.log(`SELECT * FROM "books" WHERE title = '${title}`)
    influx
  .query(`SELECT * FROM "books" WHERE title='${title}'`)
  .then(results => {
    console.log(results)
    influx.writePoints([{measurement:"books", tag:{title:book.title},fields:{data:results[0].data},timestamp:results[0].time}])
})
  .then(() => {
    console.log('Data points updated successfully');
  })
  .catch(error => {
    console.error('Error:', error);
  });
}