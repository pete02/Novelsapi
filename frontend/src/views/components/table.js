function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}


const Table=({filerlist,set})=>{
    
    if(filerlist.length>0){
        let i=0
        return(
            <table>
                <tbody>
                {sliceIntoChunks(filerlist,5).map(a=>{
                    i++
                    return(<tr key={i}>
                        {a.map(b=>{
                            return(
                                <td key={b.pic}>
                                    <button onClick={()=>set(b)}>
                                        <img src={b.pic} alt="" className='photo'/>
                                    </button>
                                </td>
                            )
                        })}
                    </tr>)
                })}
                </tbody>
            </table>
        )
    }
    else return(<table></table>)
}

export default Table