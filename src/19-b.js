(()=>{
    console.clear();

    const registers = [0, 0, 0, 0, 0, 0];

    let result = 0;

    const isPartTwo  = true;
    
    let max = isPartTwo ? 10551354 : 954

    // 17 : 
    // registers[2] = 2
    // 18 : 
    // registers[2] = 2 * 2
    // 19 : 
    // registers[2] = 19 * (2 * 2)
    // 20 : 
    // registers[2] = (19 * (2 * 2)) * 11
    // 21 : 
    // registers[1] = 0 + 5
    // 22 : 
    // registers[1] = (0 + 5) * 22
    // 23 : 
    // registers[1] = ((0 + 5) * 22) + 8
    // 24 : 
    // registers[2] = 954
    // if (registers[0] === 1) {
        // 27 : 
        // registers[1] = 27
        // 28 : 
        // registers[1] = 27 * 28
        // 29 : 
        // registers[1] = 29 + (27 * 28)
        // 30 : 
        // registers[1] = 30 * (29 + (27 * 28))
        // 31 : 
        // registers[1] = (30 * (29 + (27 * 28))) * 14
        // 32 : 
        // registers[1] = ((30 * (29 + (27 * 28))) * 14) * 32
        // 33 : 
        // registers[2] = 954 + 10550400
        // 34 : 
        // registers[0] = 0
    // }

    console.log(registers)

    const factors = [];

    for (let i = 1; i <= max; i++) {
        if (max % i === 0) {
            factors.push(i);
        }
    }

    console.log(factors)

    factors.forEach(i => {
        factors.forEach(j => {
            if (i * j === max) {
                // 07 : 
                result += i
            }

        })

    })

    /*
    for (let i = 1; i <= max; i++) {
        for (let j = 1; j <= max; j++) {
            if (i * j === max) {
                // 07 : 
                result += i
            }
        }
    }
    */

    /*
    // 01 : 
    let i = 1
    while (true) {
        // 02 : 
        // let j = 1
        for (let j = 1; j <= max; j++) {
            if (i * j === max) {
                // 07 : 
                result += i
            }
        }
        /*
        while (true) {
            // 03 : 
            // registers[1] = registers[4] * registers[5]

            // 04 : 
            // registers[1] = registers[1] === registers[2] ? 1 : 0
            //05 : jump + registers[1]
            // 06 : jump 08
            if (i * j === max) {
                // 07 : 
                result += i
            }

            // 08 : 
            j++

            // 09 : 
            // registers[1] = registers[5] > registers[2] ? 1 : 0

            // 10 : jump + registers[1]
            // 11 : jump 03
            if (j > max) {
                break
            }
        }
        
        // 12 : 
        i++;

        // 13 : 
        // registers[1] = registers[4] > registers[2] ? 1 : 0
        // 14 : jump + registers[1]
        // 15 : jump 02
        // console.log(registers[0], registers[4], registers[2])
        if (i > max) {
            break;
        }
    }
    */

    console.log('result :', result)
}
)()
