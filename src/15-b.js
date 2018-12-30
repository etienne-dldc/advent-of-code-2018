(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num => Array(num).fill(null).map((v, i) => i);
    const rangeFrom = (f, t) => range(t - f).map(v => f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    
    let content = `#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########
`

    content = document.querySelector('pre').innerText;
  
    document.querySelector('pre').innerText = content;

    const lines = content.split('\n').filter(line => line.length > 0);

    const grid = lines.map(line => line.split(''));

    const originalGrid = grid.map(line => line.slice());

    let units = [];

    grid.forEach((line, y) => {
        line.forEach((cell, x) => {
            if (cell === 'G') {
                units.push({
                    type: 'Goblin',
                    x: x,
                    y: y,
                    life: 200,
                    attack: 3,
                    dead: false
                })
                grid[y][x] = '.';
            }
            if (cell === 'E') {
                units.push({
                    type: 'Elf',
                    x: x,
                    y: y,
                    life: 200,
                    attack: 3,
                    dead: false
                })
                grid[y][x] = '.';
            }
        })
    })

    const earth = grid.map(line => line.map(cell => {
        if (cell === '.') {
            return true;
        }
        if (cell === '#') {
            return false;
        }
        throw new Error('Invalid cell ' + cell)
    }))

    const mapHeight = earth.length;
    const mapWidth = earth[0].length;

    const coords = earth.map((line, y) => line.map((cell, x) => ({ x, y })));

    const getCoord = (x, y) => {
        if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) {
            return null;
        }
        return coords[y][x];
    }

    const getAt = (x, y) => {
        if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) {
            return false;
        }
        const mapValue = earth[y][x];
        if (mapValue) {
            const unitFound = units.filter(unit => unit.dead === false).find(unit => (unit.x === x && unit.y === y));
            if (unitFound) {
                return unitFound;
            }
            return true;
        }
        return false;
    }

    const getAroundCoord = (x, y) => ([
        { x: x, y: y-1 },
        { x: x-1, y: y },
        { x: x+1, y: y },
        { x: x, y: y+1 },
    ])

    const getAround = (x, y) => getAroundCoord(x, y).map(coord => getAt(coord.x, coord.y))

    const dedupe = arr => arr.reduce((acc, i) => {
        if (acc.indexOf(i) >= 0) {
            return acc;
        }
        acc.push(i);
        return acc;
    }, []);

    const findDistance = (origin, dest, max = Infinity) => {
        const target = getCoord(dest.x, dest.y);
        const originCoord = getCoord(origin.x, origin.y);
        if (target === originCoord) {
            return 0;
        }
        let handled = [];
        let current = [originCoord];
        let found = false;
        let dist = 0;
        let safe = 100;
        while(safe > 0 && found === false && current.length > 0 && dist < max) {
            safe--;
            current = dedupe(current.map(coord => {
                return getAroundCoord(coord.x, coord.y).map(c => getCoord(c.x, c.y));
            }).flat()).filter(coord => handled.indexOf(coord) === -1);
            if (current.indexOf(target) >= 0) {
                found = true;
            }
            handled = dedupe(handled.concat(current));
            current = current.filter(coord => getAt(coord.x, coord.y) === true);
            dist++
        }
        if (safe === 0) {
            console.log('Hit safe in findDistance')
        }
        if (current.length === 0) {
            return false;
        }
        if (dist >= max) {
            return false;
        }
        return dist;
    }

    const findPaths = (origin, dest, distance) => {
        // console.log({ origin, dest, distance })
        const arounds = getAroundCoord(origin.x, origin.y)
            .filter(coord => getAt(coord.x, coord.y) === true)
            .filter(around => {
                return findDistance(around, dest) === distance - 1;
            })
        return arounds;
    }

    const sortByReadingOrder = arr => {
        arr.sort((left, right) => {
            if (left.y !== right.y) {
                return left.y - right.y;
            }
            return left.x - right.x;
        })
        return arr;
    }

    // console.log(units);

    let rounds = 0;
    let done = false;
    let nextUnit = 0
    let safe = 100 * units.length;

    const unitTurn = unit => {
        if (unit.dead) {
            return;
        }
        // console.log(unit);
        let around = getAround(unit.x, unit.y);
        let enemyAround = around.filter(v => (v && v.type && v.type !== unit.type && v.dead === false));
        if (enemyAround.length === 0) {
            // move
            const allInRange = units.filter(v => v.type !== unit.type && v.dead === false).map(enemy => {
               return getAroundCoord(enemy.x, enemy.y);
            }).flat().reduce((acc, item) => {
                const content = getAt(item.x, item.y);
                if (content !== true) {
                    return acc;
                }
                const alreadyIn = acc.find(i => i.x === item.x && i.y === item.y);
                if (alreadyIn) {
                    return acc;
                }
                acc.push(item);
                return acc;
            }, []);
            let minDist = Infinity;
            const coordWithDist = allInRange.map(coord => {
                const dist = findDistance(unit, coord);
                if (dist !== false && dist < minDist) {
                    minDist = dist;
                }
                return {
                    ...coord,
                    dist
                }
            }).filter(i => i.dist !== false);
            // If has something reachable
            if (coordWithDist.length > 0) {
                const closest = coordWithDist.filter(i => i.dist === minDist);
                if (closest.length === 0) {
                    throw new Error('Whaaat ?');
                }
                let target = sortByReadingOrder(closest)[0];
                const paths = findPaths(unit, target, minDist);
                const moveTo = sortByReadingOrder(paths)[0];
                unit.x = moveTo.x;
                unit.y = moveTo.y;
            }
        }
        // attack
        around = getAround(unit.x, unit.y);
        enemyAround = around.filter(v => (v && v.type && v.type !== unit.type && v.dead === false));
        if (enemyAround.length === 0) {
            return;

        }
        enemyAround.sort((left, right) => {
            if (left.life !== right.life) {
                return left.life - right.life;
            }
            if (left.y !== right.y) {
                return left.y - right.y;
            }
            return left.x - right.x;
        })
        const enemyToAttack = enemyAround[0];
        enemyToAttack.life = enemyToAttack.life - unit.attack;
        if (enemyToAttack.life <= 0) {
            enemyToAttack.dead = true;
        }
    }

    const loop = () => {
        const unit = units[nextUnit];
        let enemies = units.filter(v => v.dead === false && v.type !== unit.type);
        if (enemies.length === 0) {
            done = true;
            return;
        }
        unitTurn(unit);
        enemies = units.filter(v => v.dead === false && v.type !== unit.type);
        if (enemies.length === 0) {
            done = true;
            return;
        }

        nextUnit++;
        if (nextUnit >= units.length) {
            nextUnit = 0;
            console.log('round ' + rounds + ' done');
            // print
            if (false) {
                const print = earth.map(line => line.map(v => v ? '.' : '#'));
                units.forEach(unit => {
                    if (unit.dead === false) {
                        print[unit.y][unit.x] = unit.type[0];
                    }
                })
                document.querySelector('pre').innerText += [
                    '',
                    `After ${rounds + 1} rounds`,
                    print.map(line => line.join('')).join('\n'),
                    units.map(u => `${u.type[0]}(${u.life})`).join('  '),
                    ''
                ].join('\n');
            }
            
            rounds++;

            // sort unit by reading order
            units.sort((left, right) => {
                if (left.y !== right.y) {
                    return left.y - right.y;
                }
                return left.x - right.x;
            });
        }
    }

    const run = (elfPower) => {
        console.log('running with elfPower = ' + elfPower);

        rounds = 0;
        done = false;
        nextUnit = 0
        safe = 100 * units.length;
        units = [];

        originalGrid.forEach((line, y) => {
            line.forEach((cell, x) => {
                if (cell === 'G') {
                    units.push({
                        type: 'Goblin',
                        x: x,
                        y: y,
                        life: 200,
                        attack: 3,
                        dead: false
                    })
                }
                if (cell === 'E') {
                    units.push({
                        type: 'Elf',
                        x: x,
                        y: y,
                        life: 200,
                        attack: elfPower,
                        dead: false
                    })
                }
            })
        })

        while(safe > 0 && done === false) {
            safe--;
            loop();
        } 
        if (safe === 0) {
            console.log('Hit safe in loop')
        }

        const totalLife = units.filter(u => u.dead === false).reduce((acc, i) => acc + i.life, 0);
        console.log({ rounds, units, totalLife, answer: rounds * totalLife });
        
        // const deadElf = units.filter(u => u.dead === true && u.type === 'Elf');

        // console.log({ deadElf })
    }

    let noDeadElf = false;

    let elfPower = 6;

    run(20)

    /*
    while(noDeadElf === false) {
        run(elfPower)
        const deadElf = units.filter(u => u.dead === true && u.type === 'Elf');
        console.log('Dead Elfs : ' + deadElf.length);
        noDeadElf = deadElf.length === 0;
        elfPower += 1;
    }
    */

})()