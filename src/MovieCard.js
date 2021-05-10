import React from 'react'
import './App.css'


function MovieCard({ item, index, isBtnDisabled, addtoNominations, removeFromNomination}) {
    return (
        <li className="Card">
            <p className="header-sub">{item.Title}({item.Year})</p>
            {
                addtoNominations ?             
                <button disabled={isBtnDisabled(item)} onClick={()=> addtoNominations(item)}>Add to nominate</button>
                : 
                <button onClick={()=> removeFromNomination(index)}>Remove</button>
            }
        </li>
    )
}

export default MovieCard