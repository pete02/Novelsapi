import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import Books from './views/books';
import Getnew from './views/getnew';
import Modify from './views/modify';
import arrow from './views/components/arrow.png'


function App() {
  let [b1,setb1]= useState(true)
  let [b2,setb2]= useState(false)
  let [b3,setb3]= useState(false)
  let [num,setNum]=useState(1)
  let [status,SetStatus]=useState("idle")
  let [rotation,setRotation]=useState(0)
  const bu1=(event)=>{
    event.preventDefault();
    setb1(true)
    setb2(false)
    setb3(false)
  }




  useEffect(()=>{
    setTimeout(()=>{
      axios.get("/api/status").then(r=>{
        SetStatus(r.data)
        setNum(num+1)
      })
    },100)
  },[num])

  const bu2=(event)=>{
    event.preventDefault();
    setb2(true)
    setb1(false)
    setb3(false)
  }

  const bu3=(event)=>{
    event.preventDefault();
    setb3(true)
    setb2(false)
    setb1(false)
  }

  return(
    <div className='all'>
      <div className='border'>
      <button className='borderbutton' onClick={()=>{
        axios.get("/api/update/")
        setRotation(rotation+360)
        }}> 
        <img style={{transform: `rotate(${rotation}deg)`}} src={arrow} alt="" className={(status==="idle")?"arrow":"arrowspin"}></img>
       </button>
        <div className='status'>
        
          {status}
        </div>
      </div>
      <div className='banner'>
        
        <button className='button' onClick={bu1}>
          
          Main page
          {b1&&<div className='block'></div>}          
          </button>
        <button className='button' onClick={bu2}>Search new books
        {b2&&<div className='block'></div>}  
        </button>
        <button className='button' onClick={bu3}>Modify
        {b3&&<div className='block'></div>}  
        </button>
      </div>
      {b1&&<Books/>}
      {b2&&<Getnew/>}
      {b3&&<Modify/>}

    </div>
  )
}

export default App;
