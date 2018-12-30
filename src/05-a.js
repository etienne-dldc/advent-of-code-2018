(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();

    const range = num => Array(num).fill(null).map((v, i) => i);

    let content = document.querySelector('pre').innerText;

    let letters = content.split('').filter(v => v.length > 0 && v !== '\n').join('');

    // console.log(result.slice(-100).join(''));

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    const reduce = (poly) => {
        let result = poly;
        let replaced = true;
        while (replaced) {
            // console.log('Replace')
            let prevResult = result;
            alphabet.forEach(l => {
                result = result.replace(l + l.toUpperCase(), '');
                result = result.replace(l.toUpperCase() + l, '');
            })
            replaced = prevResult.length !== result.length;
        }
        return result;
    }

    console.log(reduce(letters).length)
    
})()