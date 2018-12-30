(() => {

    console.clear();

    const range = num => Array(num).fill(null).map((v, i) => i);

    let content = document.querySelector('pre').innerHTML;

    let lines = content.split('\n').filter(v => v.length > 0);

    console.log(`Lines count: ${lines.length}`)

    const regWakeUp = /^\[(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2}) (?<hour>[0-9]{2}):(?<minute>[0-9]{2})\] wakes up$/;
    const regFallsAsleep = /^\[(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2}) (?<hour>[0-9]{2}):(?<minute>[0-9]{2})\] falls asleep$/;
    const regGuard = /^\[(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2}) (?<hour>[0-9]{2}):(?<minute>[0-9]{2})\] Guard #(?<id>[0-9]+) begins shift$/;

    const logs = lines.sort().map((line, index) => {
        const isGuard = line.match(regGuard);
        if (isGuard) {
            return {
                type: 'guard',
                year: isGuard.groups.year,
                month: isGuard.groups.month,
                day: isGuard.groups.day,
                hour: parseInt(isGuard.groups.hour, 10),
                minute: parseInt(isGuard.groups.minute, 10),
                id: isGuard.groups.id,
            }
        }

        const isSleep = line.match(regFallsAsleep);
        if (isSleep) {
            return {
                type: 'sleep',
                year: isSleep.groups.year,
                month: isSleep.groups.month,
                day: isSleep.groups.day,
                hour: parseInt(isSleep.groups.hour, 10),
                minute: parseInt(isSleep.groups.minute, 10),
            }
        }

        const isWake = line.match(regWakeUp);
        if (isWake) {
            return {
                type: 'wake',
                year: isWake.groups.year,
                month: isWake.groups.month,
                day: isWake.groups.day,
                hour: parseInt(isWake.groups.hour, 10),
                minute: parseInt(isWake.groups.minute, 10),
            }
        }
        console.warn('error line ' + index);
        console.log(data)
        return null
    })

    const guards = {};
    let currentGuard = null
    let lastSleep = null

    logs.forEach(item => {
        if (item.type === 'guard') {
            currentGuard = item.id;
            if (!guards[currentGuard]) {
                guards[currentGuard] = range(60).map(v => 0);   
            }
            return;
        }
        if (item.type === 'sleep') {
            lastSleep = item.minute;
            return;
        }
        if (item.type === 'wake') {
            for (let i = lastSleep; i < item.minute; i++) {
                guards[currentGuard][i] += 1;
            }
            return;
        }
    })

    let result = null;
    let resultGuard = null
    let resultMinute = null

    Object.keys(guards).forEach(guard => {
        guards[guard].forEach((val, minute) => {
            if (result === null) {
                result = val;
                resultGuard = guard;
                resultMinute = minute;
                return;
            }
            if (val > result) {
                result = val;
                resultGuard = guard;
                resultMinute = minute;
                return;
            }
            
        })
    })

    console.log(guards);

    console.log(resultGuard, resultMinute)


    
})()