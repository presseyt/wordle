import { colorGuess } from './helpers.js';

function Row({ target, guess, submitted, error }) {
    const colors = submitted && colorGuess(target, guess);

    return (
        <div className={`Row${error % 2 ? ' Row--error' : ''}${error > 1 ? ' Row--red' : ''}`}>
            {[...target].map((c, i) => (
                <div
                    className={colors ? `Letter ${colors[i]}` : 'Letter'}
                    style={{ transitionDelay: `${i * 100}ms` }}
                >
                    {guess[i] ? guess[i].toUpperCase() : null}
                </div>
            ))}
        </div>
    );
}

export default Row;
