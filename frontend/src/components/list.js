const List=({current})=>{
    return(
        <div>{
            current.books.map(b=>{return(
                <div><button key={b.book}>{b.book}</button></div>
                )})
            }</div>
    )
    
}

export default List