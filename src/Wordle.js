import { useEffect, useState } from 'react';
import Row from './Row.js';
import KeyBoard from './KeyBoard.js';
import Modal from './Modal.js';

const initialState = ['', '', '', '', '', ''];
const makeGivenStr = (givens, target) => {
    if (!givens || !target) return '';
    if (typeof givens === 'string') return givens;

    const letterWeights = { A: 1, B: 6, C: 6, D: 4, E: 1, F: 10, G: 5, H: 9, I: 1,
        J: 28, K: 15, L: 4, M: 5, N: 4, O: 1, P: 6, Q: 35, R: 3, S: 3, T: 3, U: 2,
        V: 11, W: 10, X: 28, Y: 9, Z: 30 };
    [...target].forEach((letter) => (letterWeights[letter] = 0));
    let totalWeight = Object.values(letterWeights).reduce((acc, cur) => acc + cur);
    let str = '';
    while (str.length < givens) {
        const rnd = Math.floor(Math.random() * totalWeight);
        let n = 0;
        const letter = Object.keys(letterWeights).find((key) => {
            n += letterWeights[key];
            return n > rnd;
        });
        str += letter;
        totalWeight -= letterWeights[letter];
        letterWeights[letter] = 0;
        if (totalWeight <= 0) throw new Error('too many givens');
    }
    return str;
}

function Wordle({ target, isValidWord, onNewGame, givens }) {
    const [guesses, setGuesses] = useState(initialState);
    const [i, setI] = useState(0);
    const [error, setError] = useState(0);
    const [modalDisplay, setModalDisplay] = useState(false);
    const [givenStr, setGivenStr] = useState(makeGivenStr(givens, target));

    useEffect(() => {
        setGuesses(initialState);
        setI(0);
        setError(0);
        setModalDisplay(false);
        setGivenStr(makeGivenStr(givens, target));
    }, [target])

    const handleKeyDown = (e) => {
        if (i >= guesses.length || guesses[i - 1] === target) return;

        if (e.key === 'Backspace') {
            const newGuesses = [...guesses];
            newGuesses[i] = guesses[i].slice(0, -1);
            setError(0)
            setGuesses(newGuesses);
        } else if (e.key === 'Enter' && guesses[i].length === target.length) {
            if (isValidWord(guesses[i])) {
                setI(i + 1);
                if (i >= guesses.length - 1 || guesses[i] === target) {
                    setTimeout(() => setModalDisplay(true), 1000)
                }
            } else {
                setError(error + 1);
            }
        } else if (/^[a-zA-Z]$/.test(e.key) && guesses[i].length < target.length) {
            const newGuesses = [...guesses];
            newGuesses[i] = guesses[i] + e.key.toUpperCase();
            setGuesses(newGuesses);
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
      <div className="Wordle" onKeyDown={handleKeyDown}>
          <div className="Wordle__board">
              {guesses.map((guess, j) => (
                  <Row target={target} guess={guess} submitted={j < i} error={j === i && error} />
              ))}
          </div>
          <KeyBoard target={target} guesses={guesses.slice(0, i)} onChange={handleKeyDown} givens={givenStr} />
          {modalDisplay && guesses[i - 1] === target ? (
              <Modal open onClose={() => setModalDisplay(false)}>
                  You won!
                  <button onClick={onNewGame}> Play Again </button>
              </Modal>
          ) : modalDisplay && i >= guesses.length && (
              <Modal open onClose={() => setModalDisplay(false)}>
                  You lost!  The wordle was {target}
                  <button onClick={onNewGame}> Play Again </button>
              </Modal>
          )}
      </div>
    );
}

export default Wordle;
