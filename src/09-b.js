(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num => Array(num).fill(null).map((v, i) => i);
    const rangeFrom = (f, t) => range(t - f).map(v => f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const padLeft = (data,size,paddingChar) => (new Array(size + 1).join(paddingChar || '0') + String(data)).slice(-size)

    const playersCount = 428;
    const lastMarble = 7206100;

    const players = range(playersCount).map(v => 0);
    const circle = [0];
    let current = 0

    let mod = 0

    let timeA = 0;
    let timeB = 0;
    let countA = 0;
    let countB = 0;

    const logMod = 0b11111111111;

    function process(turn) {
        mod += 1;
        if (mod === 23) {
            mod = 0;
        }
        if ((turn & logMod) === logMod) {
            // const res = console.timeEnd('step')
            console.log(turn)
            // console.time('step')
        }
        if (turn === 1) {
            circle.push(turn);
            current = 1;
            return;
        }
        if (turn === 2) {
            circle.splice(1, 0, turn);
            current = 1;
            return;
        }
        if (mod === 0) {
            let t = performance.now()
            const playerIndex = turn % players.length;
            players[playerIndex] += turn;
            const removeIndex = (circle.length + (current - 7)) % circle.length;
            const toRemoveItem = circle[removeIndex];
            players[playerIndex] += toRemoveItem;
            circle.splice(removeIndex, 1);
            current = removeIndex % circle.length;
            timeA += (performance.now() - t)
            countA++
            return;
        }
        let t = performance.now()
        let insertIndex = (current + 2);
        if (insertIndex >= circle.length) {
            insertIndex = insertIndex - circle.length
        }
        if (insertIndex === 0) {
            circle.push(turn);
            current = circle.length - 1
        } else {
            circle.splice(insertIndex, 0, turn);
            current = insertIndex   
        }
        timeB += (performance.now() - t)
        countB++
    }

    console.time()

    range(lastMarble).map(x => x + 1).forEach(process)

    const maxScore = Math.max(...players);

    console.log({
        timeA,
        countA,
        avA: timeA / countA,
        timeB,
        countB,
        avB: timeB / countB,
    })

    console.timeEnd()

    
    console.log('maxScore: ' + maxScore)

})()