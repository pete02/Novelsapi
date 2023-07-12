import './books.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from './components/table';
import Overlay from './components/overlay';

async function fetch(){
  try{
    let r=(await axios.get("/api/json")).data
    console.log(r)
    return r
  }catch{
    console.log("erro")
    return []
  }
  
}



function Books() {
  const [list,SetList]=useState([])
  const [filerlist,Setfilterlist]=useState([[],[],[],[],[]])
  const [search,setSearch]= useState("")
  const [isOpen,setOpen]=useState(false)
  const [current, setCurrent]=useState({"img":""})
  useEffect(()=>{
    fetch().then(a=>SetList(a))
  },[])


  useEffect(()=>{
    onSubmit(search)
  },[list])

  const changeSearch=(event)=>{
    event.preventDefault()
    setSearch(event.target.value)
    onSubmit(event.target.value)
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit()
    }
  };


  const toggle=(a)=>{
    setCurrent(a)
    setOpen(!isOpen)
  }



  const onSubmit=(s)=>{

    if(list){
      if(s){
        let l2=list.filter(a=>a.serarch.find(b=>b.includes(s)))
        console.log(l2.map((l,i)=>console.log(i)))
        Setfilterlist(l2)
      }else{
        Setfilterlist(list)
      }
      
    }
    
  }

  return (
    <div className="App">
      <header className="App-header">
        <form>
          <input value={search} onChange={changeSearch} onKeyDown={handleKeyDown}></input>
        </form>
        <Overlay isOpen={isOpen} onClose={toggle} current={current}><h1>open</h1></Overlay>
        <Table filerlist={filerlist}set={toggle}/>
      </header>
    </div>
  );
}

export default Books;
