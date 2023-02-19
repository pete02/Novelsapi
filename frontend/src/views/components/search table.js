
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

            setSum(b.summary.split("<br>"))
            setB(b.books.length)
            setTitle(b.title)
            setBook(b)
        }
        
        console.log("flipå")
        isflipped(!flip)
    }
    if(filerlist.length>0){
        let i=0
        return(
            <div className='Tablediv'>
                <table className='Table'>
                    <tbody>
                    {sliceIntoChunks(filerlist,5).map(a=>{
                        i++
                        return(<tr key={i}>
                            {a.map(b=>{
                                return(
                                    <td key={b.pic}>
                                        <div className="flippable">
                                            <div className={flip?"notflipped":"pflipped"}>
                                                <button className='photob' onClick={(event)=>{
                                                    event.preventDefault()
                                                    flopped(b)}}>
                                                    <img src={b.pic} className="photo" alt=""/>
                                                </button>
                                            </div>
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
                        <div>
                            <button onClick={(event)=>{
                                event.preventDefault()
                                axios.post("localhost:3001//api/series",{book})
                            }} className="getbut">get</button>
                        </div>
                        <br/>
                        <div>{title}</div>
                        <div>{sum.map(a=><p><br/>{a}</p>)}</div>
                        <div> Books:{b}</div>
                        </button>
                </div>
            </div>
            
        )
    }
    else return(<table></table>)
}

export default SearchTable