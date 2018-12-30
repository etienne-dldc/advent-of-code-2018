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

    const workers = [
        { step: null, time: 0 },
        { step: null, time: 0 },
        { step: null, time: 0 },
        { step: null, time: 0 },
        { step: null, time: 0 }
    ]

    const getNextStep = () => {
        const filtered = allStepsNames
        .filter(name => resolved.indexOf(name) === -1)
        .filter(name => workers.map(w => w.step).indexOf(name) === -1);
        for (a of filtered) {
            // console.log(a);
            const aDeps = deps[a];
            if (!aDeps) {
                return a;
            }
            const allResolved = aDeps.every(n => resolved.indexOf(n) >= 0);
            if (allResolved) {
                return a;
            }
        }
        return null;
    }

    const getTime = step => {
        if (step === null) {
            return 0;
        }
        return 60 + alphabet.toUpperCase().split('').indexOf(step) + 1
    }

    let time = 0;


    let safe = 100000

    const log = w => w.step === null ? '.' : w.step;

    while (safe > 0 && resolved.length < allStepsNames.length) {

        workers.forEach(w => {
            if (w.time > 0) {
                w.time -= 1;
            }
        })
        workers.forEach(w => {
            if (w.step !== null && w.time === 0) {
                resolved.push(w.step);
                w.step = null;
                w.time = 0;
                return;
            }
        })
        workers.forEach(w => {
            if (w.step === null) {
                w.step = getNextStep();
                w.time = getTime(w.step);
                return;
            }
        })
        
        console.log(`${time} \t${log(workers[0])} \t${log(workers[1])} \t${log(workers[2])} \t${log(workers[3])} \t${log(workers[4])}`)

        time++
        safe--
    }

    console.log(time);

    console.log(getNextStep())

    /*

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

    */

    // console.log(allStepsNames, deps)

})()