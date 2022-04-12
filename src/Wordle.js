import { useEffect, useState } from 'react';
import Row from './Row.js';
import KeyBoard from './KeyBoard.js';

function Wordle({ target, givens, guesses, onGuess }) {
    const [guess, setGuess] = useState('');
    const [error, setError] = useState(0);

    useEffect(() => {
        setGuess('');
        setError(0);
    }, [target])

    const handleKeyDown = (e) => {
        if (guesses.length === 6 || guesses[guesses.length - 1] === target) return;

        if (e.key === 'Backspace') {
            setError(0)
            setGuess(guess.slice(0, -1));
        } else if (e.key === 'Enter') {
            if (onGuess(guess)) {
                setError(0);
                setGuess('');
            } else {
                setError(error + 1);
            }
        } else if (/^[a-zA-Z]$/.test(e.key) && guess.length < target.length) {
            setGuess(guess + e.key.toUpperCase());
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
      <div className="Wordle">
          <div className="Wordle__board">
              {Array.from({ length: 6 }, (_, i) => (
                  <Row
                      key={i}
                      target={target}
                      guess={i < guesses.length ? guesses[i] : i === guesses.length ? guess : ''}
                      submitted={i < guesses.length}
                      error={i === guesses.length && error}
                  />
              ))}
          </div>
          <KeyBoard target={target} guesses={guesses} onChange={handleKeyDown} givens={givens} />
      </div>
    );
}

export default Wordle;
