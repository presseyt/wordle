import { colorGuess } from './helpers.js';

const qwerty = 'QWERTYUIOPASDFGHJKLZXCVBNM';
// const alphabetical = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function KeyBoard({ target, guesses, givens, onChange }) {
    const guessedLetters = guesses.join('');
    const colors = guesses.map((guess) => colorGuess(target, guess)).flat();

    const getColor = (letter) => {
        if (givens.includes(letter)) return 'grey';

        let color = 'white';
        for (let j in guessedLetters) {
            if (guessedLetters[j] === letter) {
                if (colors[j] === 'green') return 'green';
                else if (colors[j] === 'yellow') color = 'yellow';
                else if (color !== 'yellow') color = 'grey';
            }
        }
        return color;
    };

    const handleClick = (key) => () => onChange({ key });

    return (
        <div className="KeyBoard">
            <div className="KeyBoard__row">
                {[...qwerty].slice(0, 10).map((c) => (
                    <div key={c} className={`KeyBoard__key ${getColor(c)}`} onClick={handleClick(c)}>{c}</div>
                ))}
            </div>
            <div className="KeyBoard__row">
                {[...qwerty].slice(10, 19).map((c) => (
                    <div key={c} className={`KeyBoard__key ${getColor(c)}`} onClick={handleClick(c)}>{c}</div>
                ))}
            </div>
            <div className="KeyBoard__row">
                <div className="KeyBoard__key KeyBoard__enter white" onClick={handleClick('Enter')}>{'Enter'}</div>
                {[...qwerty].slice(19, 26).map((c) => (
                    <div key={c} className={`KeyBoard__key ${getColor(c)}`} onClick={handleClick(c)}>{c}</div>
                ))}
                <div className="KeyBoard__key white" onClick={handleClick('Backspace')}>{'<='}</div>
            </div>
        </div>
    );
}

export default KeyBoard;
