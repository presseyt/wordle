import { useState, useEffect } from 'react';
import Wordle from './Wordle.js';
import './App.css';

import {
    threeLetterWords,
    fourLetterWords,
    fourLetterJQXZ,
    sixLetterWords,
    sixLetterTargets,
    sevenLetterWords,
    sevenLetterTargets,
} from './words'

const gameModes = {
    three: { dictionary: threeLetterWords, targets: threeLetterWords, givens: 8 },
    four: { dictionary: fourLetterWords, targets: fourLetterWords, givens: 5 },
    fourJQXZ: { dictionary: fourLetterJQXZ, targets: fourLetterJQXZ },
    six: { dictionary: sixLetterWords, targets: sixLetterTargets },
    dailySix: { dictionary: sixLetterWords, targets: sixLetterTargets, daily: true },
    curatedSix: { dictionary: sixLetterWords, targets: sixLetterTargets, daily: true },
    seven: { dictionary: sevenLetterWords, targets: sevenLetterTargets },
    dailySeven: { dictionary: sevenLetterWords, targets: sevenLetterTargets, daily: true },
    curatedSeven: { dictionary: sevenLetterWords, targets: sevenLetterTargets, daily: true },
};

const setVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
const getDailyWord = (_targets) => {
    const daysElapsed = Math.floor((new Date() - new Date('2022-03-01')) / (24*60*60*1000)) + 15;
    const prime = 881; // 863
    const index = prime * daysElapsed % _targets.length;
    const permute = (word) => word[4] + word[2] + word[1] + word[5] + word[0] + word[3] + word[6];
    const jumbled = _targets.map(permute).sort();
    return permute(jumbled[index]).slice(0, _targets[0].length);
}
const getRandomTarget = (_targets) => {
    if (!_targets) return null;
    const index = Math.floor(Math.random() * _targets.length);
    return _targets[index];
}


function App() {
    const [{ targets, dictionary, givens, daily }, setMode] = useState(gameModes.three);
    const [targetWord, setTargetWord] = useState(daily ? getDailyWord(targets) : getRandomTarget(targets));

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
            <Wordle target={targetWord} onNewGame={play} isValidWord={isValidWord} givens={givens} />
        </div>
    );
}

export default App;
