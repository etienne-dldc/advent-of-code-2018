(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num => Array(num).fill(null).map((v, i) => i);
    const rangeFrom = (f, t) => range(t - f).map(v => f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let content = document.querySelector('pre').innerText;

    const lines = content.split('\n');

    const firstLine = lines.shift();

    const initialState = firstLine.slice(15).split('').map(v => v === '#' ? true : false)

    const rulesStr = lines.filter(line => line.length > 0);
    const rules = range(32).map(v => false);
    rulesStr.forEach(rule => {
        const parts = rule.split(' ');
        const num = parseInt(parts[0].replace(/#/g, '1').replace(/\./g, '0'), 2);
        const result = parts[2] === '#' ? true : false;
        rules[num] = result;
    })

    let state = initialState;
    let startIndex = 0;

    const toNum = (b1, b2, b3, b4, b5) => {
        return (
            ((b1 || false) ? 1 : 0) * 16 +
            ((b2 || false) ? 1 : 0) * 8 +
            ((b3 || false) ? 1 : 0) * 4 +
            ((b4 || false) ? 1 : 0) * 2 +
            ((b5 || false) ? 1 : 0)
        )
    }

    const generations = 20;

    const logState = (g, state, startIndex) => console.log(
        range(3 - String(g).length).map(v => ' ').join('') + String(g) + ':' +
        range(20 + startIndex).map(v => ' ').join('') + state.map(v => v ? '#' : ".").join('')
    );

    logState(0, state, startIndex)

    for (let g = 0; g < generations; g++) {
 
        const prevState = state;
        const endIndex = startIndex + prevState.length;
        state = [];
        for (let i = startIndex - 3; i <= endIndex + 2; i++) {
            const index = i - startIndex;
            const num = toNum(
                prevState[index-2],
                prevState[index-1],
                prevState[index],
                prevState[index+1],
                prevState[index+2]
            );
            const result = !!rules[num];
            state.push(result)
        }
        
        startIndex = startIndex - 3;
        
        while (state.length && state[state.length - 1] !== true) {
            state.pop();
        }
        while (state.length && state[0] !== true) {
            state.shift()
            startIndex += 1;
        }
    }

    let sum = 0;

    for (let i = startIndex; i <= startIndex + state.length; i++) {
        if (state[i - startIndex]) {
            sum += i;
        }
    }

    console.log('sum : ' + sum);

})()