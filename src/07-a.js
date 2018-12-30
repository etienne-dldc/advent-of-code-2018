(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num => Array(num).fill(null).map((v, i) => i);
    const rangeFrom = (f, t) => range(t - f).map(v => f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let content = document.querySelector('pre').innerText;

    const lineReg = /^Step (?<dep>[A-Z]) must be finished before step (?<step>[A-Z]) can begin\.$/

    const allSteps = {};

    let depsList = content.split('\n').filter(v => v.length > 0 && v !== '\n').map(v => {
        const match = v.match(lineReg);
        if (match) {
            return {
                step: match.groups.step,
                dep: match.groups.dep,
            }
        }
        console.warn('Not match');
        return null;
    })

    const deps = {};

    depsList.forEach(dep => {
        allSteps[dep.step] = true;
        allSteps[dep.dep] = true;
        deps[dep.step] = [...(deps[dep.step] || []), dep.dep]
    })

    const allStepsNames = Object.keys(allSteps).sort()

    const resolved = [];

    range(allStepsNames.length).forEach(i => {
        const filtered = allStepsNames.filter(name => resolved.indexOf(name) === -1);
        for (a of filtered) {
            // console.log(a);
            const aDeps = deps[a];
            if (!aDeps) {
                resolved.push(a);
                break;
            }
            const allResolved = aDeps.every(n => resolved.indexOf(n) >= 0);
            if (allResolved) {
                resolved.push(a);
                break;
            }
        }
    })

    console.log(resolved);
    console.log(resolved.join(''));

    // console.log(allStepsNames, deps)

})()