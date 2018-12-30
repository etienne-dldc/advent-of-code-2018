(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num => Array(num).fill(null).map((v, i) => i);
    const rangeFrom = (f, t) => range(t - f).map(v => f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let content = document.querySelector('pre').innerText;
    /*
    content = `/->-\\        
|   |  /----\\
| /-+--+-\\  |
| | |  | v  |
\\-+-/  \\-+--/
  \\------/   `
  */

    const lines = content.split('\n').filter(line => line.length > 0);

    const grid = lines.map(line => line.split(''));

    console.log(grid);

    const carts = [];

    const cartsChar = ['^', 'v', '<', '>']

    const dirLoop = [270, 0, 90];

    grid.forEach((line, y) => {
        line.forEach((char, x) => {
            if (char === '^') {
                carts.push({ x, y, dir: 0, last: 2 });
                grid[y][x] = '|'
            }
            if (char === 'v') {
                carts.push({ x, y, dir: 180, last: 2 });
                grid[y][x] = '|'
            }
            if (char === '<') {
                carts.push({ x, y, dir: 270, last: 2 });
                grid[y][x] = '-'
            }
            if (char === '>') {
                carts.push({ x, y, dir: 90, last: 2 });
                grid[y][x] = '-'
            }
        })
    })

    let safe = 300 - 98;
    let collision = null;

    while(safe > 0 && collision === null) {

        carts.sort((left, right) => {
            if (left.y !== right.y) {
                return left.y - right.y;
            }
            return left.x - right.x;
        })

        /*
        if (true) {
            const gridCopy = grid.map(line => line.slice());
            carts.forEach(cart => {
                gridCopy[cart.y][cart.x] = cart.dir === 0 ? '^' : cart.dir === 90 ? '>' : cart.dir === 180 ? 'v' : '<';
            })
            // console.log(gridCopy.map(line => line.join('')).join('\n'));
        }
        */

        safe--;
        carts.forEach((cart, index) => {
            const nextCoord = { x: cart.x, y: cart.y };
            if (cart.dir === 0) {
                nextCoord.y -= 1
            } else if (cart.dir === 180) {
                nextCoord.y += 1
            } else if (cart.dir === 270) {
                nextCoord.x -= 1
            } else if (cart.dir === 90) {
                nextCoord.x += 1
            }
            const hasCollision = carts.find((colCart, colIndex) => {
                return colIndex !== index && colCart.x === nextCoord.x && colCart.y === nextCoord.y
            })
            if (hasCollision && !collision) {
                collision = { x: nextCoord.x, y: nextCoord.y };
            }
            cart.x = nextCoord.x;
            cart.y = nextCoord.y;
            const nextChar = grid[nextCoord.y][nextCoord.x];
            if (nextChar === '\\') {
                if (cart.dir === 0) {
                    cart.dir = 270
                } else if (cart.dir === 90) {
                    cart.dir = 180
                } else if (cart.dir === 180) {
                    cart.dir = 90
                } else {
                    cart.dir = 0
                }
            } else if (nextChar === '/') {
                if (cart.dir === 0) {
                    cart.dir = 90
                } else if (cart.dir === 90) {
                    cart.dir = 0
                } else if (cart.dir === 180) {
                    cart.dir = 270
                } else {
                    cart.dir = 180
                }
            } else if (nextChar === '+') {
                const lastTurn = cart.last;
                const nextTurn = (lastTurn + 1) % dirLoop.length;
                cart.last = nextTurn;
                cart.dir = (cart.dir += dirLoop[nextTurn]) % 360;
            } else if (nextChar === '|' || nextChar === '-') {
                // do nothing
            } else {
                throw new Error('Invalid nextChar: "' + nextChar + '"');
            }
        })

    }

    console.log(safe)
    console.log(collision)
})()