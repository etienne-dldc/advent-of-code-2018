(() => {

    let content = document.querySelector('pre').innerHTML;

    let lines = content.split('\n').filter(v => v.length > 0);

    console.log(`Lines count: ${lines.length}`)

    let withTwo = 0;
    let withThree = 0;

    lines.forEach(line => {
        const letters = line.split('').sort();
        const counts = letters.reduce((acc, letter, index) => {
            if (index === 0) {
                return [1];
            }
            const prevLetter = letters[index - 1];
            if (letter === prevLetter) {
                acc[acc.length - 1] = acc[acc.length - 1] + 1;
            } else {
                acc.push(1);
            }
            return acc;
        }, [])
        if (counts.indexOf(3) >= 0) {
            withThree++
        }
        if (counts.indexOf(2) >= 0) {
            withTwo++
        }
    })

    console.log({
        withThree,
        withTwo,
        result: withThree * withTwo
    })


})()