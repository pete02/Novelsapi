import { useState } from 'react';
import './App.css';
import Books from './views/books';
import Getnew from './views/getnew';



function App() {
  let [b1,setb1]= useState(true)
  let [b2,setb2]= useState(false)
  let [b3,setb3]= useState(false)
  const bu1=(event)=>{
    event.preventDefault();
    setb1(true)
    setb2(false)
    setb3(false)
  }

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
      {b3&&<div>3</div>}

    </div>
  )
}

export default App;
