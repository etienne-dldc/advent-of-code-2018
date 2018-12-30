(() => {

    console.clear();

    const range = num => Array(num).fill(null).map((v, i) => i);
    
    const serial = 3613;
    const gridSize = 300

    const grid = range(gridSize)
        .map(x => x + 1)
        .map(x => 
            range(gridSize)
                .map(y => y + 1)
                .map(y => {
                    const rackId = x + 10;
                    const val = (rackId * y + serial) * rackId;
                    const digit = String(val).split('').reverse()[2] || 0;
                    return digit - 5
                })
        )

    console.log(grid)

    const selectSize = 3;

    let biggestVal = -Infinity;
    let biggestCoord = null;

    range(gridSize).map(v => v + 1).forEach(selectSize => {
        console.log(selectSize)
        range(gridSize - (selectSize - 1)).forEach(x => {
            range(gridSize - (selectSize - 1)).forEach(y => {
                const sum = range(selectSize).map(sx => {
                    return range(selectSize).map(sy => {
                        return grid[x + sx][y + sy];
                    }).reduce((acc, v) => acc + v, 0)
                }).reduce((acc, v) => acc + v, 0)
                if (sum > biggestVal) {
                    biggestVal = sum;
                    biggestCoord = { x: x + 1, y: y + 1, selectSize }
                }
            })
        })
    })

    console.log(biggestCoord)
    

})()