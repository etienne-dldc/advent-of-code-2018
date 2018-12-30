(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num => Array(num).fill(null).map((v, i) => i);
    const rangeFrom = (f, t) => range(t - f).map(v => f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let content = document.querySelector('pre').innerText;
    // let content = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2';

    const nums = content.split('\n')[0].split(' ').map(v => parseInt(v, 10));

    const handle = (chain, depth) => {
        // console.log(depth, chain.length)
        const count = chain[0];
        const size = chain[1];
        let rest = chain.slice(2);
        let children = [];
        while (children.length < count) {
            // console.log(depth, rest)
            const newChild = handle(rest, depth + 1);
            // console.log(newChild)
            rest = newChild.rest.slice();
            children.push(newChild)
        }

        // console.log(depth, rest)

        const data = rest.slice(0, size);
        rest = rest.slice(size);

        return ({ count, size, data, rest, children })
    }

    const tree = handle(nums, 0);

    console.log('====')
    console.log(tree)

    const sum = node => {
        return [...node.data, ...node.children.map(n => sum(n))].reduce((acc, i) => acc + i, 0)
    }

    console.log('====')
    console.log(sum(tree))


})()