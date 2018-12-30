(() => {

    console.clear();

    const range = num => Array(num).fill(null).map((v, i) => i);

    let content = document.querySelector('pre').innerHTML;

    let lines = content.split('\n').filter(v => v.length > 0);

    console.log(`Lines count: ${lines.length}`)

    const parsingReg = /^#(?<id>[0-9]+) @ (?<left>[0-9]+),(?<top>[0-9]+): (?<width>[0-9]+)x(?<height>[0-9]+)$/

    const rects = lines.map((line, index) => {
        const data = line.match(parsingReg);
        if (!data) {
            console.warn('error line ' + index);
            console.log(data)
            return null
        }
        // console.log(data);
        const width = parseInt(data.groups.width, 10);
        const height = parseInt(data.groups.height, 10);
        const left = parseInt(data.groups.left, 10);
        const top = parseInt(data.groups.top, 10);
        return {
            id: data.groups.id,
            left,
            top,
            right: left + width,
            bottom: top + height
        }
    })

    let count = 0;


    let invalids = {};

    // ([0]).map(i => {
    range(rects.length).map(i => {
        range(rects.length).map(j => {
            
            const a = rects[i];
            const b = rects[j];

            // console.log(a, b)
            if (count < 100) {
                // console.log(i, j)
            }

            if (count % 10000 === 0) {
                console.log(count)
            }
            count++

            if (i === j) {
                return
            }

            // if (a.invalid && b.invalid) {
            //     return
            // }

            // const intersect = a.left >= b.left && a.left <= b.right && a.top >= b.top && a.top <= b.bottom;
            // const intersectInverse = false // b.left >= a.left && b.left <= a.right && b.top >= a.top && b.top <= a.bottom;
            
            const intersect = !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top);
            
            // console.log({ intersect, intersectInverse })

            if (intersect) {
                invalids[a.id] = true;
                invalids[b.id] = true;
                // a.invalid = true;
                // b.invalid = true
            }
        })
    })

    /*
    const grid = range(1000).map(x => range(1000).map(v => null))

    range(1000).map(x => {
        range(1000).map(y => {
            if (count % 1000 === 0) {
                console.log(count)
            }
            count++
            rects.forEach(rect => {
                if (rect.invalid) {
                    return
                }
                if (grid[x][y] === false){
                    return;
                }
                if (x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom) {
                    if (grid[x][y] !== null) {
                        grid[x][y] = false
                        rect.invalid = true
                        return;
                    }
                    grid[x][y] = rect.id
                }
            })
        })
    })*/

    console.log(count)

    // const total = grid.map(v => v.filter(x => x > 1).length).reduce((acc, v) => acc + v, 0);
    
    // console.log(rects)

    // console.log(rects.filter(rect => !rect.invalid))

    console.log(invalids);
    console.log(Object.keys(invalids).length);
    console.log(rects.filter(rect => invalids[rect.id] !== true))

})()