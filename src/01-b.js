(() => {

    let content = document.querySelector('pre').innerHTML;

    let steps = content.split('\n').filter(v => v.length > 0).map(v => parseInt(v, 10));

    let results = [0]

    let twice = null;
    let index = 0
    let acc = 0

    while (twice === null) {
        const item = steps[index % steps.length];
        acc = acc + item;
        if (results.indexOf(acc) >= 0) {
            twice = acc
        }
        results.push(acc);
        index++
    }

    console.log(twice)

})()