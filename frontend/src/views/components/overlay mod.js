
import { ReactDOM, useEffect, useState } from "react";
import "./overlay.css";
import List from "./bookbutton mod";
import axios from "axios";

let search=[]

function Makel({a,i}){
    const [name,setname]=useState(a)

    const changelist=(event)=>{
        setname(event.target.value)
        search[i]=event.target.value
        console.log(search)
    }

    return(
        <div>
            <input value={name}onChange={changelist}></input>
        </div>
    )
}


export function Overlay({ isOpen, onClose, current }) {
    const [title,setTitle]=useState("")
    const [list,setList]=useState([""])

    useEffect(()=>{
        setList([])
        console.log(current.title)
        setTitle(current.title)
        console.log(title)
    },[current.title])

    useEffect(()=>{
        setList([])
        if(current.serarch){
            setList(current.serarch)
            search=current.serarch
         }
    },[current.serarch])


    const change=(event)=>{
        event.preventDefault()
        setTitle(event.target.value)
    }


    const send=(event)=>{
        event.preventDefault()
        axios.post("/api/modify",{"i":current.index,"book":{"title":title,"search":search}})
    }
    const add=(event)=>{
        event.preventDefault()
        setList([...list,""])
    }
    const del=(event)=>{
        event.preventDefault()
        axios.post("/api/delete",{"i":current.index})
    }

    const Click=(event)=>{
        event.preventDefault()
        console.log(current.index)
    }
    return(<div>
        {isOpen&& <div className="overlay">
            <button className="b" onClick={onClose}></button>
                <div className="block">
                    <a className="ovimg" href={"https://thatnovelcorner.com/"+current.link} target="_blank" rel="noreferrer">
                    <img className="ovimg"src={current.pic} alt=""/>
                    </a>
                    <button className="apply" onClick={send}>Apply</button>
                    <button className="delete">Delete</button>
                    <div className="title">
                        <div>
                            <p>title</p>
                            <input value={title} onChange={change}></input>
                        </div>

                        <div>
                            <p>search</p>
                            <button onClick={add}>add</button>
                            {list.map((a,i)=>{
                            console.log(i)
                            return(
                                <Makel a={a} i={i}/>
                            )
                            
                        })}</div>
                        <br/>
                        <div className="buttons">{
                            current.books.length>0&&<div>{
                                <List current={current}/>
                            }</div>
                        }</div>
                    </div>
                    
            </div>
            
            </div>}
    </div>
    )
  }
  
  export default Overlay;