import { useState, useEffect } from 'react';
import Wordle from './Wordle.js';
import './App.css';

import {
    sixLetterWords,
    sixLetterTargets,
    fourLetterWords,
    fourLetterJQXZ,
    sevenLetterWords,
    sevenLetterTargets,
} from './words'

const setVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
const getDailyWord = (_targets) => {
    const daysElapsed = Math.floor((new Date() - new Date('2022-03-01')) / (24*60*60*1000)) + 15;
    const prime = 881; // 863
    const index = prime * daysElapsed % _targets.length;

    const permute = (word) => word[4] + word[2] + word[1] + word[5] + word[0] + word[3] + word[6];
    // const permute = (word) => word[4] + word[2] + word[1] + word[5] + word[0] + word[3];
    // const permute = (word) =>  word[2] + word[1] + word[0] + word[3];

    const jumbled = _targets.map(permute).sort();
    return permute(jumbled[index]);
}
const getRandomTarget = (_targets) => {
    if (!_targets) return null;
    const index = Math.floor(Math.random() * _targets.length);
    return _targets[index];
}


function App() {
    const [daily, setDaily] = useState(localStorage.getItem('daily') ?? true);

    const [targets, setTargets] = useState(sevenLetterTargets);
    const [dictionary, setDictionary] = useState(sevenLetterWords);
    const [targetWord, setTargetWord] = useState(getDailyWord(targets));

    const isValidWord = (str) => dictionary.includes(str.toUpperCase());

    const play = () => setTargetWord(getRandomTarget(targets));

    useEffect(() => {
        setVH();
        window.onresize = setVH;
    }, [])

    return (
        <div className="App">
            <div className="App__header">
                Scwordle
                <button onClick={play}>Play Again</button>
            </div>
            <Wordle target={targetWord} onNewGame={play} isValidWord={isValidWord} />
        </div>
    );
}

export default App;
