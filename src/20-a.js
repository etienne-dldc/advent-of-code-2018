(()=>{

    console.clear();

    const inverseCase = v=>v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num=>Array(num).fill(null).map((v,i)=>i);
    const rangeFrom = (f,t)=>range(t - f).map(v=>f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let content = `^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$`

    content = `^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$`;

    // content = `^ENWWW(NEEE|SSE(EE|N))$`;

    content = `^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$`

    content = document.querySelector('pre').innerText;

    const reg = content.split('\n')[0];

    // console.log(reg)

    const parts = reg.split('');

    let path = [];
    const tree = { type: 'and', items: [] };

    parts.forEach(letter => {
        if (letter === 'N' || letter === 'S' || letter === 'E' || letter === 'W') {
            let current = path.reduce((acc, i) => acc.items[i], tree);
            current.items.push(letter);
        }
        if (letter === '|') {
            path.pop();
            let current = path.reduce((acc, i) => acc.items[i], tree);
            path.push(current.items.length);
            current.items.push({ type: 'and', items: [] });
        }
        if (letter === '(') {
            let current = path.reduce((acc, i) => acc.items[i], tree);
            path.push(current.items.length, 0);
            current.items.push({ type: 'or', items: [{ type: 'and', items: [] }] })
        }
        if (letter === ')') {
            path.pop();
            path.pop();   
        }
    })

    console.log(tree)

    const serialize = (item) => {
        if (item.type === 'and') {
            return item.items.map(serialize).join('');
        }
        if (item.type === 'or') {
            return '(' + item.items.map(serialize).join('|') + ')';
        }
        return item;
    }

    console.log('^' + serialize(tree) + '$' === reg);

    // ===== 

    let next = [tree]

    const blueprint = new Map();

    const distances = new Map();

    let safe = 30000;
    let position = { x: 0, y: 0 };
    let dist = 0
    const positionHistory = [];
    const distHistory = [];

    const strPos = (pos) => pos.x + '_' + pos.y;

    const getRoom = (pos) => {
        const key = strPos(pos)
        if (blueprint.has(key)) {
            return blueprint.get(key);
        }
        const newRoom = {
            n: false,
            s: false,
            e: false,
            w: false
        };
        blueprint.set(key, newRoom);
        return newRoom;
    }

    const handleMove = (direction) => {
        dist++;
        if (direction === 'S') {
            getRoom(position).s = true
            position.y += 1;
            getRoom(position).n = true
        }
        if (direction === 'N') {
            getRoom(position).n = true
            position.y -= 1;
            getRoom(position).s = true
        }
        if (direction === 'E') {
            getRoom(position).e = true
            position.x += 1;
            getRoom(position).w = true
        }
        if (direction === 'W') {
            getRoom(position).w = true
            position.x -= 1;
            getRoom(position).e = true
        }
        const newPos = strPos(position)
        if (!distances.has(newPos)) {
            distances.set(newPos, dist);
        } else {
            distances.set(newPos, Math.min(dist, distances.get(newPos)));
        }
    }


    const loop = () => {
        const nextItem = next.shift();
        if (nextItem === 'restore') {
            position = positionHistory[positionHistory.length - 1];
            dist = distHistory[distHistory.length - 1];
            return
        }
        if (nextItem === 'pop') {
            position = positionHistory.pop();
            dist = distHistory.pop();
            return;
        }
        if (typeof nextItem === 'string') {
            handleMove(nextItem);
            // console.log(position);
            return;
        }
        if (nextItem.type === 'and') {
            next.unshift(...nextItem.items);
            return;
        }
        if (nextItem.type === 'or') {
            positionHistory.push({ ...position });
            distHistory.push(dist);
            next.unshift('pop');
            nextItem.items.forEach(item => {
                next.unshift('restore');
                next.unshift(item);
            })
            return
        }     
    }

    while (next.length > 0 && safe > 0) {
        // console.log(next)
        safe--;
        loop();
    }

    if (safe <= 0) {
        console.warn('Safe hit')
    }

    console.log(blueprint);
    console.log(distances);

    const maxDist = Math.max(...Array.from(distances.values()));

    const under1000 = Array.from(distances.values()).filter(d => d >= 1000).length

    console.log(Array.from(distances.values()).sort((l, r) => l - r).slice(0, 100))

    console.log({ maxDist, under1000 })

    return;

    const objPos = (str) => {
        return str.split('_').reduce((acc, v, i, arr) => {
            return {
                x: parseInt(arr[0], 10),
                y: parseInt(arr[1], 10)
            }
        })
    }

    Array.from(blueprint.entries()).forEach(([k, v]) => {
        const pos = objPos(k);
        if (v.n) {
            const other = blueprint.get(strPos({ ...pos, y: pos.y - 1 }))
            if (other.s !== true) {
                console.warn('Whaaat', pos, other);
            }
        }
        if (v.s) {
            const other = blueprint.get(strPos({ ...pos, y: pos.y + 1 }))
            if (other.n !== true) {
                console.warn('Whaaat', pos, other);
            }
        }
        if (v.e) {
            const other = blueprint.get(strPos({ ...pos, x: pos.x + 1 }))
            if (other.w !== true) {
                console.warn('Whaaat', pos, other);
            }
        }
        if (v.w) {
            const other = blueprint.get(strPos({ ...pos, x: pos.x - 1 }))
            if (other.e !== true) {
                console.warn('Whaaat', pos, other);
            }
        }
    })

    // =====

    const grid = range(250).map(x => range(250).map(x => '#'));

    Array.from(blueprint.entries()).forEach(([k, v]) => {
        const pos = objPos(k);
        grid[(pos.y * 2) + 125][(pos.x * 2) + 125] = ' ';
        if (v.n) {
            grid[((pos.y * 2) + 125) - 1][(pos.x * 2) + 125] = '-';
        }
        if (v.s) {
            grid[((pos.y * 2) + 125) + 1][(pos.x * 2) + 125] = '-';
        }
        if (v.e) {
            grid[((pos.y * 2) + 125)][((pos.x * 2) + 125) + 1] = '|';
        }
        if (v.w) {
            grid[((pos.y * 2) + 125)][((pos.x * 2) + 125) - 1] = '|';
        }
    })

    grid[125][125] = 'X'

    copy(grid.map(line => line.join('')).join('\n'));


    // ============

    const dedupe = arr => arr.reduce((acc, i) => {
        if (acc.indexOf(i) >= 0) {
            return acc;
        }
        acc.push(i);
        return acc;
    }, []);

    /*
    const findDistance = (origin, dest) => {
        if (origin === dest) {
            return 0;
        }
        let handled = [];
        let current = [origin];
        let found = false;
        let dist = 0;
        let safe = 500;
        while(safe > 0 && found === false && current.length > 0) {
            safe--;
            current = dedupe(current.map(coord => {
                const pos = objPos(coord)
                const room = getRoom(pos);
                return [
                    room.n ? { ...pos, y: pos.y - 1 } : false,
                    room.s ? { ...pos, y: pos.y + 1 } : false,
                    room.e ? { ...pos, x: pos.x + 1 } : false,
                    room.w ? { ...pos, x: pos.x - 1 } : false,
                ].filter(v => v !== false).map(strPos);
            }).flat()).filter(coord => handled.indexOf(coord) === -1);
            // console.log(current, dest)
            if (current.indexOf(dest) >= 0) {
                found = true;
            }
            handled = dedupe(handled.concat(current));
            dist++
        }
        if (safe === 0) {
            console.log('Hit safe in findDistance')
        }
        if (current.length === 0) {
            return false;
        }
        return dist;
    }
    */

    console.log(blueprint);

    // console.log(blueprint.size);

    // const distances = new Map();

    const getRoomWarn = (pos) => {
        const key = strPos(pos)
        if (blueprint.has(key)) {
            return blueprint.get(key);
        }
        console.warn(pos)
        const newRoom = {
            n: false,
            s: false,
            e: false,
            w: false
        };
        blueprint.set(key, newRoom);
        return newRoom;
    }

    const findDistances = () => {
        let handled = [];
        let current = ['0_0'];
        let dist = 1;
        let safe = 2000;
        while(safe > 0 && current.length > 0) {
            safe--;
            current = dedupe(current.map(coord => {
                const pos = objPos(coord)
                const room = getRoomWarn(pos);
                return [
                    room.n ? { ...pos, y: pos.y - 1 } : false,
                    room.s ? { ...pos, y: pos.y + 1 } : false,
                    room.e ? { ...pos, x: pos.x + 1 } : false,
                    room.w ? { ...pos, x: pos.x - 1 } : false,
                ].filter(v => v !== false).map(strPos);
            }).flat()).filter(coord => handled.indexOf(coord) === -1);
            // console.log(current, dest)
            // console.log(current)
            current.forEach(pos => {
                // console.log(distances.has(pos))
                if (!distances.has(pos)) {
                    distances.set(pos, dist);
                }
            })
            handled = dedupe(handled.concat(current));
            dist++
        }
        if (safe === 0) {
            console.log('Hit safe in findDistance')
        }
    }

    // findDistances();

    console.log(distances)

    // const maxDist = Math.max(...Array.from(distances.values()));

    // console.log({ maxDist })

}
)()
