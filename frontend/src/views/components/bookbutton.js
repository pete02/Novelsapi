import axios from 'axios'
import './bookbutton.css'

const List=({current})=>{
    return(
        <div>{
            current.books.map(b=>{return(
                <div><button className="bbutton" key={b.book}  onClick={(event)=>{
                    event.preventDefault()
                    console.log(b.link)
                    axios.post("/api/get",{"link":b.link})}} >{b.book}
                </button>
                {(b.owned)?<button className='owned'/>:<button className='not_owned'/>}
                </div>
                )})
            }</div>
    )
    
}

export default List