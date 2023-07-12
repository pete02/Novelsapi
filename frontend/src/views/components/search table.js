
import './searchtable.css'
import { useState } from 'react';
import axios from 'axios';
function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}


const SearchTable=({filerlist,set})=>{
    const [flip,isflipped]=useState(true)
    const [sum,setSum]=useState([])
    const [b,setB]=useState()
    const [title,setTitle]=useState("")
    const [book,setBook]=useState({})
    const flopped=(b)=>{
        if(b){
            console.log(b)
            setSum(b.sum)
            setB(b.books.length)
            setTitle(b.title)
            setBook(b)
        }
        
        console.log("flipå")
        isflipped(!flip)
    }
    const screenWidth = window.innerWidth;
    const photoWidth = 200;
    const maxPhotos = Math.min(Math.floor(screenWidth / photoWidth), 5);
    if(filerlist.length>0){
        let i=0
        return(
            <div className='Tablediv'>
                <table className='Table'>
                    <tbody>
                    {sliceIntoChunks(filerlist,maxPhotos).map(a=>{
                        i++
                        return(<tr key={i}>
                            {a.map(b=>{
                                return(
                                    <td key={b.pic}>
                                        <div className="flippable">
                                            {
                                            flip?<div className={flip?"notflipped":"pflipped"}>
                                            <button className='photob' onClick={(event)=>{
                                                event.preventDefault()
                                                console.log("pressed")
                                                flopped(b)}}>
                                                <img src={b.pic} className="photo" alt=""/>
                                            </button>
                                        </div>:<div>test</div>
                                            }
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>)
                    })}
                    </tbody>
                </table>
                <div className={flip?"pflipped":"notflipped"}>

                

                        <button className="Container"onClick={(event)=>{
                            event.preventDefault()
                            flopped(null) 
                        }}>
                            <button onClick={(event)=>{
                                event.preventDefault()
                                axios.post("/api/save",{book}
                                )
                            }} className="getbut">get</button>
                        <br/>
                        <br/>
                        <br/>
                        <div>{title}</div>
                        <div>{sum}</div>
                        <div> Books:{b}</div>
                        </button>
                </div>
            </div>
            
        )
    }
    else return(<table></table>)
}

export default SearchTable