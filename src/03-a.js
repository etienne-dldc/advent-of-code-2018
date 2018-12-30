(() => {

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
            left,
            top,
            right: left + width,
            bottom: top + height
        }
    })

    const overlapses = {};

    console.log(rects)

    let count = 0;

    const grid = range(1000).map(x => range(1000).map(v => 0))

    range(1000).map(x => {
        range(1000).map(y => {
            if (count % 1000 === 0) {
                console.log(count)
            }
            count++
            let caseCount = 0;
            rects.forEach(rect => {
                if (x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom) {
                    caseCount++
                }
            })
            grid[x][y] = caseCount;
        })
    })

    console.log(count)

    const total = grid.map(v => v.filter(x => x > 1).length).reduce((acc, v) => acc + v, 0);

    console.log(total)

    /*
    range(rects.length - 1).map(i => {
        range(rects.length - 1 - i).map(j => {
            const a = rects[i];
            const b = rects[j];
            if (i === j) {
                return
            }

            if (count % 100 === 0) {
                console.log(count)
            }

            count++

            const intersectLeft = Math.max(a.left, b.left) - Math.min(a.left, b.left);
            const intersectTop = Math.max(a.top, b.top) - Math.min(a.top, b.top);
            const intersectBottom = Math.max(a.bottom, b.bottom) - Math.min(a.bottom, b.bottom);
            const intersectRight = Math.max(a.right, b.right) - Math.min(a.right, b.right);

            const intersectWidth = 1000 - intersectLeft - intersectRight;
            const intersectHeight = 1000 - intersectTop - intersectBottom;

            if (intersectWidth <= 0 || intersectHeight <= 0) {
                return;
            }

            range(intersectWidth).map(ix => {
                range(intersectHeight).map(iy => {
                    const x = intersectLeft + ix;
                    const y = intersectTop + iy;
                    overlapses[x + 'x' + y] = true
                })
            })

        })
    })
    */

    console.log(overlapses);

})()