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
        let theCount = 0;
        rangeFrom(lim.t, lim.b).forEach(x => {
            rangeFrom(lim.l, lim.r).forEach(y => {
                let current = null;
                points.forEach((p, index) => {
                    const d = dist(p, { x, y });
                    current += d;
                })
                if (current < 10000) {
                    theCount += 1;
                }
            })
        })

        console.log(theCount);
    }

    compute(expand(limits, 20));


})()