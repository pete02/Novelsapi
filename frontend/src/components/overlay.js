
import { ReactDOM } from "react";
import "./overlay.css";
import List from "./list";

export function Overlay({ isOpen, onClose, current }) {
    return(<div>
        {isOpen&& <div className="overlay">
            <button className="b" onClick={onClose}></button>
                <div className="block">
                    <a className="ovimg" href={current.link} target="_blank" rel="noreferrer">
                    <img className="ovimg"src={current.pic} alt=""/>
                    </a>
                    <div className="title">
                        <h1 className="test">{current.title}</h1>
                        <div>{current.search.map(a=><div>{a}<br/></div>)}</div>
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