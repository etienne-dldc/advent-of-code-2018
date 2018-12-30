(()=>{

    console.clear();

    const inverseCase = v=>v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num=>Array(num).fill(null).map((v,i)=>i);
    const rangeFrom = (f,t)=>range(t - f).map(v=>f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let content = `
.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.`;

    content = document.querySelector('pre').innerText;

    let grid = content.split('\n').filter(line=>line.length > 0).map(line=>line.split(''));

    const get = (x, y) => {
        if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
            return '.';
        }
        return grid[y][x];
    }

    const print = () => {
        const txt = grid.map(line => line.join('')).join('\n');
        console.log(txt);
    }

    print();

    range(10).forEach(() => {
        const newGrid = grid.map((line, y) => line.map((cell, x) => {
            const around = [
                get(x-1, y-1),
                get(x-1, y  ),
                get(x-1, y+1),
                get(x  , y-1),
                // get(x  , y  ),
                get(x  , y+1),
                get(x+1, y-1),
                get(x+1, y  ),
                get(x+1, y+1)
            ]
            const trees = around.filter(x => x === '|').length;
            const lumberyard = around.filter(x => x === '#').length;

            if (cell === '.') {
                if (trees >= 3) {
                    return '|';
                }
                return '.'
            }
            if (cell === '|') {
                if (lumberyard >= 3) {
                    return '#'
                }
                return '|'
            }
            if (cell === '#') {
                if (lumberyard >= 1 && trees >= 1) {
                    return '#'
                }
                return '.'
            }
            throw new Error('Whaat ?');
        }))

        grid = newGrid;
        print();
    })

    const trees = grid.flat().filter(x => x === '|').length;
    const lumberyard = grid.flat().filter(x => x === '#').length;

    console.log({
        trees,
        lumberyard,
        result: lumberyard * trees
    })

}
)()
