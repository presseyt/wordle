import { useState } from 'react';
import { gameModes, getDailyWord, getLocalStorageJson } from './helpers';

function Settings({ mode, onSelect }) {
    const [selected, setSelected] = useState(mode);
    return (
        <div className="Settings">
            <div className="Settings__daily">
                {Object.values(gameModes).filter(gameMode => gameMode.daily).map(gameMode => {
                    const state = getLocalStorageJson(gameMode.mode, {});
                    const isSameDay = getDailyWord(gameMode.targets) === state.target;
                    const solved = state.guesses?.findIndex(guess => guess === state.target) + 1;
                    return (
                        <div>
                            <button
                                className={gameMode.mode === selected ? 'selected' : !solved ? 'green' : undefined}
                                onClick={() => onSelect(gameMode)}
                                key={gameMode.mode}
                            >
                                {gameMode.text}
                            </button>
                            {isSameDay && (solved ? `Solved in ${solved}` : gameMode.mode !== selected && 'Continue')}
                        </div>
                    )
                })}
            </div>
            <hr />
            <div className="Settings__practice">
                {Object.values(gameModes).filter(gameMode => !gameMode.daily).map(gameMode => (
                    <button
                        className={gameMode.mode === selected ? 'selected' : undefined}
                        onClick={() => setSelected(gameMode.mode)}
                        key={gameMode.mode}
                    >
                        {gameMode.text}
                    </button>
                ))}
            </div>
            <button className="Play" onClick={() => onSelect(gameModes[selected])}>Play</button>
        </div>
    );
}

export default Settings;
