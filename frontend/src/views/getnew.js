
import axios from 'axios'
import { useState } from 'react'
import './getnew.css'
import Table from './components/table'
function Getnew(){

    let [search,setSearch]= useState('')
    let [book,setBook]=useState([])
    const changeSearch=(event)=>{
        event.preventDefault()
        setSearch(event.target.value)
    }

    const find=(event)=>{
        event.preventDefault()
        console.log("getting")
        axios.post("http://localhost:3001/api/findseries",{"book":search}).then(data=>{
            setBook(data.data)
        })
    }
    const toggle=(b)=>{
        console.log(b.summary)

    }

    return(<div className="test">

        <form>
            <input value={search} onChange={changeSearch}></input>
            <button className='get' onClick={find}>get new book</button>
        </form>
        <Table filerlist={book}set={toggle}/>
    </div>)
}

export default Getnew