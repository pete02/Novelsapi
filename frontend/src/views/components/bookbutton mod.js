import axios from 'axios'
import './bookbutton.css'

const List=({current})=>{
    return(
        <div>{
            current.books.map((i,b)=>{
                console.log(b)
                return(
                
                <div>
                    {i.book}   
                    <button className="bbutton" onClick={(event)=>{
                        event.preventDefault()
                        axios.post("/api/owned",{"series":current.index,"book":b,"owned":true})
                    }}>owned</button>   
                    <button className="bbutton"onClick={(event)=>{
                        event.preventDefault()
                        axios.post("/api/owned",{"series":current.index,"book":b,"owned":false})
                    }}>not owned</button>
                    {(i.owned)?<button className='owned'/>:<button className='not_owned'/>}
                </div>

                )})
            }</div>
    )
    
}

export default List