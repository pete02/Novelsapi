import axios from 'axios'
import './bookbutton.css'

const List=({current})=>{
    return(
        <div>{
            current.books.map(b=>{return(
                <div><button className="bbutton" key={b.book}  onClick={(event)=>{
                    event.preventDefault()
                    console.log(b.link)
                    axios.post("http://localhost:3001/api/get",{"link":b.link})}} >{b.book}
                </button></div>
                )})
            }</div>
    )
    
}

export default List