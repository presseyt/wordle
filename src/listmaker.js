import { useState } from 'react';
import { words } from './6words.js';

function ListMaker() {
    const [arr, setArr] = useState([]);
    const toggle = (i) => {
        if (arr.includes(i)) setArr(arr.filter(x => x!== i));
        else setArr([...arr, i]);
    }
    const print = () => {
        console.log(JSON.stringify(arr.map(i => words[i]).sort()));
    }

    return (
        <div className="ListMaker">
            <button onClick={print}>PRINT</button>
            {words.map((word, i) => (
                <button
                    className={arr.includes(i) ? 'ListButton--right' : ''}
                    onClick={() => toggle(i)}
                >
                    {word}
                </button>
            ))}
        </div>
    );
}

export default ListMaker;
