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

    const print = (grid)=>{
        const txt = grid.map(line=>line.join('')).join('\n');
        console.log(txt);
    }

    function run(state, minutes) {
        const visited = [];
        let loop = null;
        let time = minutes;
        let grid = state.split('\n').filter(line=>line.length > 0).map(line=>line.split(''));
        ;
        const get = (x,y)=>{
            if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
                return '.';
            }
            return grid[y][x];
        }

        while (time > 0 && loop === null) {
            const newGrid = grid.map((line,y)=>line.map((cell,x)=>{
                const around = [get(x - 1, y - 1), get(x - 1, y), get(x - 1, y + 1), get(x, y - 1), // get(x  , y  ),
                get(x, y + 1), get(x + 1, y - 1), get(x + 1, y), get(x + 1, y + 1)]
                const trees = around.filter(x=>x === '|').length;
                const lumberyard = around.filter(x=>x === '#').length;

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
            }
            ))

            const txt = grid.map(line=>line.join('')).join('\n');
            if (visited.indexOf(txt) >= 0) {
                loop = {
                    loop: true,
                    time: minutes - time,
                    size: (minutes - time) - visited.indexOf(txt),
                    index: visited.indexOf(txt),
                    state: txt
                }
                console.log('visited', time)
            } else {
                visited.push(txt)
            }

            time--;

            grid = newGrid;
            // print();  
        }

        if (loop !== null) {
            return loop;
        }
        return grid;
    }

    let final = run(content, 1000);

    console.log(final);

    if (final.loop) {
        const remaining = (1000000000 - final.time) % final.size;
        console.log(remaining);
        final = run(final.state, remaining);

    }
    const trees = final.flat().filter(x=>x === '|').length;
    const lumberyard = final.flat().filter(x=>x === '#').length;

    console.log({
        trees,
        lumberyard,
        result: lumberyard * trees
    })

}
)()
