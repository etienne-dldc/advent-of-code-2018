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

    range(gridSize - (selectSize - 1)).forEach(x => {
        range(gridSize - (selectSize - 1)).forEach(y => {
            const sum = (
                grid[x][y] +
                grid[x][y+1] +
                grid[x][y+2] +
                grid[x+1][y] +
                grid[x+1][y+1] +
                grid[x+1][y+2] +
                grid[x+2][y] +
                grid[x+2][y+1] +
                grid[x+2][y+2]
            )
            if (sum > biggestVal) {
                biggestVal = sum;
                biggestCoord = { x: x + 1, y: y + 1 }
            }
        })
    })

    console.log(biggestCoord)
    

})()