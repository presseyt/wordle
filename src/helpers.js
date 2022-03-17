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
