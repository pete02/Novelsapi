
import axios from 'axios'
import { useState } from 'react'
import './getnew.css'
import SearchTable from './components/search table'
import LoadingSpinner from './components/spinner'
function Getnew(){

    let [search,setSearch]= useState('')
    let [book,setBook]=useState([])
    let [loading,setLoading]=useState(false)
    const changeSearch=(event)=>{
        event.preventDefault()
        setSearch(event.target.value)
    }

    const find=(event)=>{
        event.preventDefault()
        setLoading(true)
        console.log("getting")
        console.log(loading)
        axios.get(`/api/search?s=${search}`).then(data=>{
            setLoading(false)
            setBook(data.data)
        })
    }
    const toggle=(b)=>{
        console.log(b.summary)

    }

    return(<div className="test">

        <form>
            <input value={search} onChange={changeSearch}></input>
            <button className='get' onClick={find}>get new books</button>
        </form>
        {loading&&<LoadingSpinner/>}
        <SearchTable filerlist={book}set={toggle}/>
    </div>)
}

export default Getnew