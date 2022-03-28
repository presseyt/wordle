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
    const daysElapsed = Math.floor((new Date() - new Date('2022-03-01')) / (24*60*60*1000)) + 15;
    const prime = 881; // 863
    const index = prime * daysElapsed % targets.length;
    const permute = (word) => word[4] + word[2] + word[1] + word[5] + word[0] + word[3] + word[6];
    const jumbled = targets.map(permute).sort();
    return permute(jumbled[index]).slice(0, targets[0].length);
}

export function getRandomTarget(targets) {
    if (!targets) return null;
    const index = Math.floor(Math.random() * targets.length);
    return targets[index];
}

export function getStats(mode) {
    if (!mode) return;
    let stats = localStorage.getItem(`stats-${mode}`);
    return stats
        ? JSON.parse(stats)
        : { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, fail: 0, dnf: 0, streak: 0, maxStreak: 0 };
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
