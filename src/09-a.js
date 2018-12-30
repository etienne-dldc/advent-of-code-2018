(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num => Array(num).fill(null).map((v, i) => i);
    const rangeFrom = (f, t) => range(t - f).map(v => f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const padLeft = (data,size,paddingChar) => (new Array(size + 1).join(paddingChar || '0') + String(data)).slice(-size)

    const playersCount = 428;
    const lastMarble = 72061;

    const players = range(playersCount).map(v => 0);
    const circle = [0];
    let current = 0

    range(lastMarble).map(x => x + 1).forEach(turn => {
        (() => {
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
            if (turn % 23 === 0) {
                const playerIndex = turn % players.length;
                players[playerIndex] += turn;
                const removeIndex = (circle.length + (current - 7)) % circle.length;
                const toRemoveItem = circle[removeIndex];
                players[playerIndex] += toRemoveItem;
                circle.splice(removeIndex, 1);
                current = removeIndex % circle.length;
                return;
            }
            const insertIndex = (current + 2) % circle.length;
            if (insertIndex === 0) {
                circle.push(turn);
                current = circle.length - 1
            } else {
                circle.splice(insertIndex, 0, turn);
                current = insertIndex   
            }
        })()
        // console.log(turn + ' - ' + circle.map((v, i) => i === current ? `(${padLeft(v, 2, ' ')})` : ` ${padLeft(v, 2, ' ')} `).join(' '))
    })


    const maxScore = Math.max(...players);

    
    console.log(maxScore)

})()