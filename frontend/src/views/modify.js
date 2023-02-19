import './books.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from './components/table';
import Overlay from './components/overlay mod';


async function fetch(){
  try{
    let r=(await axios.get("/api/json")).data
    return r
  }catch{
    console.log("erro")
    return []
  }
  
}



function Modify() {
  const [list,SetList]=useState([])
  const [filerlist,Setfilterlist]=useState([[],[],[],[],[]])
  const [search,setSearch]= useState("")
  const [isOpen,setOpen]=useState(false)
  const [current, setCurrent]=useState({"img":""})

  useEffect(()=>{
    fetch().then(r=>SetList(r))
  },[])

  useEffect(()=>{
    onSubmit(search)
  },[list])

  const find=(a,s)=>{
    if(a&&a.search){
      const f=a.search.filter(b=>b.includes(s))
      return f.length>0 || (f.title && f.title.includes(s))
    }else{
      return false
    }
    
  }

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

  const ouside=(event)=>{
    event.preventDefault()
    console.log({"book":search})
    axios.post("/api/getbook",{"book":search})
      .then(a=>{
        if(a.data){
          SetList([...list,a.data])
        }else{
          console.log("null")
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
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

export default Modify;
