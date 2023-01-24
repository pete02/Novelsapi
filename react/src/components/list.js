const List=({current})=>{
    if(current.booklist.length>1){
        let i=0
        return(
            <div key={"list"}>{current.booklist.map(b=>{
            i++
            return(<div className="hover" key={"a" +i}>{
                <div key={i}>
                    <button>{b.subtitle}</button>
                    <div className="scroll">
                    <div className="books">{b.list.map(a=><div key={a.name}><button className="booksb">{a.name}</button></div>)}</div>
                    </div>
                </div>
                }</div>)})}
            </div>
        )
    }else{
        return(
            <div className="scroll2">
                <div>{current.booklist[0].list.map(a=><div key={a.name}><button className="booksb">{a.name}</button></div>)}</div>
            </div>
        )
    }
    
}

export default List