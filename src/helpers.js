import {
    threeLetterWords,
    fourLetterWords,
    fourLetterJQXZ,
    sixLetterWords,
    sixLetterTargets,
    sevenLetterWords,
    sevenLetterTargets,
} from './words'

export const gameModes = {
    '3a': { mode: '3a', dictionary: threeLetterWords, targets: threeLetterWords, numberOfGivens: 9, text: 'Three letter NASPA' },
    '4a': { mode: '4a', dictionary: fourLetterWords, targets: fourLetterWords, numberOfGivens: 5, text: 'Four letter NASPA' },
    '4b': { mode: '4b', dictionary: fourLetterJQXZ, targets: fourLetterJQXZ, text: 'Four letter NASPA JQXZ' },
    '6a': { mode: '6a', dictionary: sixLetterWords, targets: sixLetterTargets, text: 'Six letter NASPA' },
    '6d': { mode: '6d', dictionary: sixLetterWords, targets: sixLetterTargets, daily: true, text: 'Daily six' },
    '6c': { mode: '6c', dictionary: sixLetterWords, targets: sixLetterTargets, text: 'Curated six letter words' },
    '7a': { mode: '7a', dictionary: sevenLetterWords, targets: sevenLetterTargets, text: 'Seven letter NASPA' },
    '7d': { mode: '7d', dictionary: sevenLetterWords, targets: sevenLetterTargets, daily: true, text: 'Daily seven' },
    '7c': { mode: '7c', dictionary: sevenLetterWords, targets: sevenLetterTargets, text: 'Curated seven letter words' },
};

export function colorGuess(target, word) {
    if (target.length !== word.length) return null;

    let t = target, colors = [];

    // green pass
    for (let i in word) {
        if (target[i] === word[i]) {
            t = t.replace(word[i], '');
            colors.push('green');
        } else {
            colors.push('grey');
        }
    }
    // yellow pass
    for (let i in word) {
        if (t.includes(word[i]) && colors[i] !== 'green') {
            t = t.replace(word[i], '');
            colors[i] = 'yellow';
        }
    }

    return colors;
}

export function makeGivens(target, numberOfGivens) {
    if (!numberOfGivens || !target) return '';
    if (typeof numberOfGivens === 'string') return numberOfGivens;

    const letterWeights = { A: 1, B: 6, C: 6, D: 4, E: 1, F: 10, G: 5, H: 9, I: 1,
        J: 28, K: 15, L: 4, M: 5, N: 4, O: 1, P: 6, Q: 35, R: 3, S: 3, T: 3, U: 2,
        V: 11, W: 10, X: 28, Y: 9, Z: 30 };
    [...target].forEach((letter) => (letterWeights[letter] = 0));
    let totalWeight = Object.values(letterWeights).reduce((acc, cur) => acc + cur);
    let str = '';
    while (str.length < numberOfGivens) {
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

export function getDailyWord(targets) {
    const daysElapsed = Math.floor((new Date() - new Date('2022-03-01T01:00')) / (24*60*60*1000)) + 15;
    const prime = 97499; // 61129 // 863 // 881
    const index = (prime * daysElapsed) % targets.length;
    const permute = (word) => word[4] + word[2] + word[1] + word[5] + word[0] + word[3] + word[6];
    const jumbled = targets.map(permute).sort();
    return permute(jumbled[index]).slice(0, targets[0].length);
}

export function getRandomTarget(targets) {
    if (!targets) return null;
    const index = Math.floor(Math.random() * targets.length);
    return targets[index];
}

export function getLocalStorageJson(key, defaultValue) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
}

export function putLocalStorageJson(key, update, defaultValue) {
    const item = getLocalStorageJson(key, defaultValue);
    const updatedItem = { ...item, ...update };
    localStorage.setItem(key, JSON.stringify(updatedItem));
    return true;
}

const defaultStats = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, fail: 0, dnf: 0, streak: 0, maxStreak: 0 };

export function getStats(mode) {
    return getLocalStorageJson(`stats-${mode}`, defaultStats);
}

export function updateStats(mode, result) {
    const stats = getStats(mode);
    if (!stats) return false;

    stats[result] += 1; // result should be 1, 2, 3, 4, 5, 6, fail
    if (result < 7) stats.streak += 1;
    if (result === 'fail') stats.streak = 0;
    if (stats.streak > stats.maxStreak) stats.maxStreak += 1;
    localStorage.setItem(`stats-${mode}`, JSON.stringify(stats));
    return true;
}
