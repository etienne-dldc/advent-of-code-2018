(()=>{

    console.clear();

    const inverseCase = v=>v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num=>Array(num).fill(null).map((v,i)=>i);
    const rangeFrom = (f,t)=>range(t - f).map(v=>f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let content = `
x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`;

    content = document.querySelector('pre').innerText;

    const vertReg = /^x=(-?\d+), y=(-?\d+)..(-?\d+)$/;
    const horReg = /^y=(-?\d+), x=(-?\d+)..(-?\d+)$/;

    const clays = content.split('\n').filter(line => line.length > 0).map(line => {
        const vertMatch = line.match(vertReg);
        const horMatch = line.match(horReg);
        if (vertMatch) {
            return { x: parseInt(vertMatch[1], 10), y: [parseInt(vertMatch[2], 10), parseInt(vertMatch[3], 10)] }
        }
        if (horMatch) {
            return { y: parseInt(horMatch[1], 10), x: [parseInt(horMatch[2], 10), parseInt(horMatch[3], 10)] };
        }
        console.log('Invalid', line)
    })

    const allY = clays.map(clay => {
        if (Array.isArray(clay.y)) {
            return clay.y
        }
        return [clay.y]
    }).flat();

    const minY = 0;
    const maxY = Math.max(...allY);

    const allX = clays.map(clay => {
        if (Array.isArray(clay.x)) {
            return clay.x
        }
        return [clay.x]
    }).flat();

    const minX = Math.min(...allX) - 10;
    const maxX = Math.max(...allX) + 10;

    console.log({ minY, maxY, minX, maxX })

    const toRange = val => Array.isArray(val) ? rangeFrom(val[0], val[1] + 1) : [val];

    const grid = range((maxY - minY) + 1).map(x => range(maxX - minX).map(y => '.'));
    clays.forEach(clay => {
        // console.log(clay)
        toRange(clay.x).forEach(x => {
            toRange(clay.y).forEach(y => {
                // console.log(y, x)
                if (grid[y - minY] && grid[y - minY][x - minX]) {
                    grid[y - minY][x - minX] = '#'
                } else {
                    console.log('invalid', y - minY, x - minX)
                }
            })
        })
    })
    grid[0][500 - minX] = '+';

    const get = (x, y) => {
        if (y > maxY) {
            return '.';
        }
        return grid[y - minY][x - minX]
    };
    const set = (x, y, val) => {
        changed = 0;
        // console.log('set', x - minX, y, val)
        grid[y - minY][x - minX] = val;
    }

    console.log(grid);

    console.log(get(498, 2))

    const canFlowLeft = (x, y, count = 1) => {
        if (y > maxY) {
            return false;
        }
        const left = get(x - 1, y);
        if (left === '.') {
            const underLeft = get(x - 1, y + 1);
            if (underLeft === '.' || underLeft === '|') {
                return Infinity;
            }
            const next = canFlowLeft(x - 1, y, count + 1);
            if (next === false) {
                return count;
            }
            return next;
        }
        if (left === '|') {
            const underLeft = get(x - 1, y + 1);
            if (underLeft === '.' || underLeft === '|') {
                return Infinity;
            }
            const next = canFlowLeft(x - 1, y, count + 1);
            if (next === false) {
                return false;
            }
            return next;
        }
        if (left === '~') {
            const underLeft = get(x - 1, y + 1);
            if (underLeft === '.' || underLeft === '|') {
                return count;
            }
            return canFlowLeft(x - 1, y, count + 1);
        }
        return false;
    }

    const canFlowRight = (x, y, count = 1) => {
        if (y > maxY) {
            return false;
        }
        const right = get(x + 1, y);
        if (right === '.') {
            const underRight = get(x + 1, y + 1);
            if (underRight === '.' || underRight === '|') {
                return Infinity;
            }
            const next = canFlowRight(x + 1, y, count + 1);
            if (next === false) {
                return count;
            }
            return next;
        }
        if (right === '|') {
            const underRight = get(x + 1, y + 1);
            if (underRight === '.' || underRight === '|') {
                return Infinity;
            }
            const next = canFlowRight(x + 1, y, count + 1);
            if (next === false) {
                return false;
            }
            return next;
        }
        if (right === '~') {
            const underRight = get(x + 1, y + 1);
            if (underRight === '.' || underRight === '|') {
                return count;
            }
            return canFlowRight(x + 1, y, count + 1);
        }
        return false;
    }

    const canFlowDown = (x, y) => {
        if (y > maxY) {
            return false;
        }
        const under = get(x, y + 1);
        if (under === '.' || under === '|') {
            return true;   
        }
        if (under === '~') {
            const left = canFlowLeft(x, y + 1);
            const right = canFlowRight(x, y + 1);
            if ((left !== false && left !== Infinity) || (right !== false && right !== Infinity)) {
                return true;
            }
            return false;
        }
        return false;
    }

    let changed = 0;
    let safeDrop = 10000;

    let water = null;

    const dropWater = () => {
        const { x, y } = water;
        if (y > maxY) {
            return false;
        }
        safeDrop--;
        if (safeDrop <= 0) {
            console.log('hit safeDrop')
            return false;
        }
        const down = canFlowDown(x, y);
        const left = canFlowLeft(x, y);
        const right = canFlowRight(x, y);
        const current = get(x, y);

        // console.log('--', x - minX, y)
        // console.log({ current, left, right, down })
        
        if (down) {
            if (current !== '|' && current !== '+') {
                set(x, y, '|');
            }
            water.y += 1;
            // dropWater(x, y + 1);
            return true;
        }

        // In a box
        if (left !== Infinity && right !== Infinity) {
            // console.log({ current, left, right, down })
            if (current !== '~') {
                set(x, y, '~');
                return false;
            }
            if (left !== false && right === false) {
                // dropWater(x - 1, y);
                water.x -= 1;
                return true;
            }
            if (left === false && right !== false) {
                // dropWater(x + 1, y);
                water.x += 1;
                return true;
            }
            if (left < right) {
                // dropWater(x - 1, y);
                water.x -= 1;
                return true;
            } else {
                // dropWater(x + 1, y);
                water.x += 1;
                return true;
            }
            return false;
        }

        // console.log({ current, left, right, down })

        if (current === '.') {
            set(x, y, '|');
        }

        if (left === false && right === false) {
            throw new Error('Whaaat ?');
        }

        if (left === false && right === Infinity) {
            // dropWater(x + 1, y);
            water.x += 1;
            return true;
        }

        if (right === false && left === Infinity) {
            // dropWater(x - 1, y);
            water.x -= 1;
            return true;
        }

        if (left === Infinity && right === Infinity) {
            const flip = Math.random() > 0.5;
            // console.log('random', flip)
            if (flip) {
                // dropWater(x - 1, y);
                water.x -= 1;
            } else {
                // dropWater(x + 1, y);
                water.x += 1;
            }
            return true;
        }

        const aLeft = left || Infinity;
        const aRight = right || Infinity;

        if (aLeft < aRight) {
            // dropWater(x - 1, y);
            water.x -= 1;
        } else {
            // dropWater(x + 1, y);
            water.x += 1;
        }
        return true
    }

    const addWater = () => {
        safeDrop = 100000;
        // console.log('water ======')
        water = { x: 500, y: 0 };
        let keepGoing = dropWater();
        while (keepGoing) {
            keepGoing = dropWater();
        }
        
    }

    const print = () => {
        copy(grid.map(line => line.join('')).join('\n'));
        console.log('copied');
    }

    let maxSafe = 50000
    let safe = maxSafe;

    while(safe > 0 && changed < 50) {
        safe--;
        changed++;
        addWater(safe);
        if (safe % 1000 === 0) {
            console.log(1 - (safe / maxSafe));
        }
        // console.log(17912 - safe);
    }

    if (safe <= 0) {
        console.log('hit safe')
    }

    const count = grid.map(line => line.filter(x => x === '~').length).reduce((acc, i) => acc + i, 0);

    console.log(count);

    print();

}
)()
