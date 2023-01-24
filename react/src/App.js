import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from './components/table';
import Overlay from './components/overlay';

async function fetch(){
  try{
    let r=(await axios.get("http://localhost:3001/api/json")).data.list
    console.log(r)
    return r
  }catch{
    return []
  }
  
}

function App() {
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
    axios.post("http://localhost:3001/api/getbook",{"book":search})
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
      const l2=list.filter(a=>find(a,s))
      const l=[]
      let l1=[]
      let i=0
      l2.map((a,k)=>{
        l1.push(a)
        i++
        if(i===5 || l2.length-1===k){
          l.push(l1)
          i=0
          l1=[]
        }
        
      })
      Setfilterlist(l)
    }
    
  }

  return (
    <div className="App">
      <header className="App-header">
        <form>
          <input value={search} onChange={changeSearch} onKeyDown={handleKeyDown}></input><button onClick={ouside}>outside search</button>
        </form>
        <button onClick={toggle}></button>
        <Overlay isOpen={isOpen} onClose={toggle} current={current}><h1>open</h1></Overlay>
        <Table filerlist={filerlist}set={toggle}/>
      </header>
    </div>
  );
}

export default App;
