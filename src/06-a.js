(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();

    const range = num => Array(num).fill(null).map((v, i) => i);

    const rangeFrom = (f, t) => range(t - f).map(v => f + v);

    let content = document.querySelector('pre').innerText;

    const pointReg = /^(?<x>[0-9]+), (?<y>[0-9]+)$/

    let points = content.split('\n').filter(v => v.length > 0 && v !== '\n').map(v => {
        const match = v.match(pointReg);
        if (match) {
            return {
                x: parseInt(match.groups.x, 10),
                y: parseInt(match.groups.y, 10)
            }
        }
        console.warn('Not match');
        return null;

    })

    console.log(points)

    const limits = {
        l: Math.min(...points.map(p => p.x)),
        r: Math.max(...points.map(p => p.x)),
        t: Math.min(...points.map(p => p.y)),
        b: Math.max(...points.map(p => p.y)),
    }

    const expand = (lim, size) => ({
        l: lim.l - size,
        r: lim.r + size,
        t: lim.t - size,
        b: lim.b + size,
    })

    const dist = (p1, p2) => {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const chars = (alphabet + alphabet.toUpperCase() + '@#').split('');

    const compute = (lim) => {
        const width = lim.r - lim.l;
        const height = lim.b - lim.t;
        const grid = range(width).map(() => range(height).map(() => '.'))
        const count = points.map(x => 0);
        let ignore = 0;
        rangeFrom(lim.t, lim.b).forEach(x => {
            rangeFrom(lim.l, lim.r).forEach(y => {
                let current = null;
                let multiple = false
                let point = null;
                points.forEach((p, index) => {
                    const d = dist(p, { x, y });
                    if (current === null) {
                        current = d;
                        point = index;
                        return
                    }
                    if (d === current) {
                        multiple = true
                        return;
                    }
                    if (d < current) {
                        current = d;
                        point = index;
                        multiple = false
                        return
                    }
                })
                if (multiple) {
                    ignore += 1;
                    // grid[x - lim.l][y - lim.t] = '.';
                } else {
                    count[point] += 1;
                    // grid[x - lim.l][y - lim.t] = chars[point];
                }
            })
        })

        // console.log(grid.map(l => l.join('')).join('\n'))

        const sum = count.reduce((acc, i) => acc + i, 0) + ignore;

        console.log(sum, (lim.b - lim.t) * (lim.r - lim.l));

        return count;
    }

    compute(limits)


    const res = points.map(() => []);
    let prevRes = null;

    [0, 1000].forEach(exp => {
        const theRes = compute(expand(limits, exp));
        if (prevRes === null) {
            res.forEach((arr, pIndex) => arr.push(theRes[pIndex]));
            console.log(theRes)
        } else {
            res.forEach((arr, pIndex) => arr.push(theRes[pIndex] - prevRes[pIndex]));
        }
        prevRes = theRes;
    })

    console.log(res);

    const finite = res.map((arr, index) => ({ index, arr })).filter(i => i.arr[i.arr.length - 1] === 0);


    const first = finite.map(i => ({ index: i.index, val: i.arr[0] }));

    console.log(Math.max(...first.map(v => v.val)));

})()