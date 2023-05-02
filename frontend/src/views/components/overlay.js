
import {  useState } from "react";
import "./overlay.css";
import List from "./bookbutton";
import check from "./check.png"
import errorpic from "./error.png"
import LoadingSpinner from "./spinner";


export function Overlay({ isOpen, onClose, current }) {
    const [load,setload]= useState(false)
    const [ok,setOk]=useState(false)
    const [error,setError]=useState(false)
    const turn=(a)=>{
        setload(a)
        setOk(false)
        setError(false)
    }

    return(<div>
        {isOpen&& <div className="overlay">
            <button className="b" onClick={()=>{
                onClose()
                setload(false)
                setOk(false)
                setError(false)
            }}></button>
                <div className="block">
                    <a className="ovimg" href={"https://thatnovelcorner.com/"+current.link} target="_blank" rel="noreferrer">
                    <img className="ovimg"src={current.pic} alt=""/>
                    </a>
                    <div className="title">
                        <h1>{current.title}</h1>
                        <div>{current.serarch.map(a=><div>{a}<br/></div>)}</div>
                        <br/>
                        <div className="buttons">{
                            current.books.length>0&&<div>{
                                <List current={current}turn={turn}done={(a)=>{setOk(a)}}error={(a)=>{setError(a)}}/>
                            }</div>
                        }</div>
                    </div>
                    
            </div>
            <div className="loading">
                {load&&<LoadingSpinner/>}
                {ok&&<img src={check} alt="" className="ok"></img>}
                {error&& <img src={errorpic} className="ok" alt=""/>}
            </div>
            </div>}
    </div>
    )
  }
  
  export default Overlay;