
import { ReactDOM } from "react";
import "./overlay.css";
import List from "./bookbutton";

export function Overlay({ isOpen, onClose, current }) {
    return(<div>
        {isOpen&& <div className="overlay">
            <button className="b" onClick={onClose}></button>
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