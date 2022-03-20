import { useEffect, useState } from 'react';
import Row from './Row.js';
import KeyBoard from './KeyBoard.js';
import Modal from './Modal.js';

const initialState = ['', '', '', '', '', '']

function Wordle({ target, isValidWord, onNewGame }) {
    const [guesses, setGuesses] = useState(initialState);
    const [i, setI] = useState(0);
    const [error, setError] = useState(0);
    const [modalDisplay, setModalDisplay] = useState(false);

    useEffect(() => {
        setGuesses(initialState);
        setI(0);
        setError(0);
        setModalDisplay(false);
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
          <KeyBoard target={target} guesses={guesses.slice(0, i)} onChange={handleKeyDown} />
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
