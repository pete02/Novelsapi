import axios from 'axios'
import './bookbutton.css'
import { useState } from 'react'

const List=({current})=>{
    let [list,Setlist]=useState(current)
    console.log(list)
    const change=(a,i)=>{
        let  l=list
        l.books[i].owned=a
        Setlist(l)
    }
    return(
        <div>{
            current.books.map((i,b)=>{
                
                return(
                
                <div>
                    {i.book}   
                    <button className="bbutton" onClick={(event)=>{
                        event.preventDefault()
                        axios.post("/api/owned",{"series":current.index,"book":b,"owned":true})
                        change(true,i)
                    }}>owned</button>   
                    <button className="bbutton"onClick={(event)=>{
                        event.preventDefault()
                        axios.post("/api/owned",{"series":current.index,"book":b,"owned":false})
                        change(false,i)
                    }}>not owned</button>
                    {(i.owned)?<button className='owned'/>:<button className='not_owned'/>}
                </div>

                )})
            }</div>
    )
    
}

export default List