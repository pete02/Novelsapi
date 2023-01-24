
import { ReactDOM } from "react";
import "./overlay.css";
import List from "./list";

export function Overlay({ isOpen, onClose, current }) {
    return(<div>
        {isOpen&& <div className="overlay">
            <button className="b" onClick={onClose}></button>
                <div className="block">
                    <a className="ovimg" href={current.link}>
                    <img className="ovimg"src={current.img} alt=""/>
                    </a>
                    <div className="title">
                        <h1 className="test">{current.search}</h1>
                        <div>{current.title.map(a=><div key={a}>{a}<br/></div>)}</div>
                        <br/>
                        <div className="buttons">{
                            current.booklist.length>0&&<div>{
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