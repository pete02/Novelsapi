import axios from 'axios'
import { useEffect, useState } from 'react'
import './bookbutton.css'

const But=({b,i,current,turn,done,error})=>{
    const [owned,setOwned]=useState(false)

    useEffect(()=>{
        setOwned(b.owned)
    },[b])

    return(
    <div><button className="bbutton" key={b.book}  onClick={(event)=>{
        turn(true)
        event.preventDefault()
        console.log(b.link)
        axios.post("/api/get",{"link":b.link}).then(r=>{
            console.log(r.data)
            turn(false)
            if(r.data && r.data==="done"){
                done(true)
                setOwned(true)
                console.log(current)
                axios.post("/api/owned",{"series":current.title,"book":i,"owned":true})
            }else{
                error(true)
            }
        })
        
        }} >{b.name}

        
    </button>
    {(owned)?<button className='owned'/>:<button className='not_owned'/>}
    </div>
    )
}

const List=({current,turn,done,error})=>{
    return(
        <div>{
            current.books.map((b,i)=>{
                return(
                <But
                    b={b}
                    i={i}
                    current={current}
                    turn={turn}
                    done={done}
                    error={error}
                    />
                )})
            }</div>
    )
    
}

export default List