(()=>{

    console.clear();

    const inverseCase = v=>v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num=>Array(num).fill(null).map((v,i)=>i);
    const rangeFrom = (f,t)=>range(t - f).map(v=>f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let content = document.querySelector('pre').innerText;

    const firstPart = content.split('\n\n\n\n')[0];
    const secondPart = content.split('\n\n\n\n')[1];

    const sampleReg = /Before: \[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]\n(-?\d+) (-?\d+) (-?\d+) (-?\d+)\nAfter:  \[(-?\d+), (-?\d+), (-?\d+), (-?\d+)\]/;

    const registerEqual = (before, after) => {
        return (
            before[0] === after[0] &&
            before[1] === after[1] &&
            before[2] === after[2] &&
            before[3] === after[3]
        )
    }

    const samples = firstPart.split('\n\n').map(v=>{
        const match = v.match(sampleReg);
        // console.log(match);
        return {
            before: [match[1], match[2], match[3], match[4]].map(v=>parseInt(v, 10)),
            opcode: parseInt(match[5], 10),
            a: parseInt(match[6], 10),
            b: parseInt(match[7], 10),
            c: parseInt(match[8], 10),
            after: [match[9], match[10], match[11], match[12]].map(v=>parseInt(v, 10))
        }
    }
    );


    const ops = [{
        name: 'addr',
        run: (registers,a,b,c)=>{
            // addr (add register) stores into register C the result of adding register A and register B
            registers[c] = registers[a] + registers[b]
        }
    }, {
        name: 'addi',
        run: (registers,a,b,c)=>{
            // addi (add immediate) stores into register C the result of adding register A and value B.
            registers[c] = registers[a] + b;
        }
    }, {
        name: 'mulr',
        run: (registers,a,b,c)=>{
            // mulr (multiply register) stores into register C the result of multiplying register A and register B.
            registers[c] = registers[a] * registers[b]
        }
    }, {
        name: 'muli',
        run: (registers,a,b,c)=>{
            // muli (multiply immediate) stores into register C the result of multiplying register A and value B.
            registers[c] = registers[a] * b;
        }
    }, {
        name: 'banr',
        run: (registers,a,b,c)=>{
            // banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
            registers[c] = registers[a] & registers[b]
        }
    }, {
        name: 'bani',
        run: (registers,a,b,c)=>{
            // bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
            registers[c] = registers[a] & b
        }
    }, {
        name: 'borr',
        run: (registers,a,b,c)=>{
            // borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
            registers[c] = registers[a] | registers[b]
        }
    }, {
        name: 'bori',
        run: (registers,a,b,c)=>{
            // bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
            registers[c] = registers[a] | b
        }
    }, {
        name: 'setr',
        run: (registers,a,b,c)=>{
            // setr (set register) copies the contents of register A into register C. (Input B is ignored.)
            registers[c] = registers[a]
        }
    }, {
        name: 'seti',
        run: (registers,a,b,c)=>{
            // seti (set immediate) stores value A into register C. (Input B is ignored.)
            registers[c] = a
        }
    }, {
        name: 'gtir',
        run: (registers,a,b,c)=>{
            // gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
            registers[c] = a > registers[b] ? 1 : 0;
        }
    }, {
        name: 'gtri',
        run: (registers,a,b,c)=>{
            // gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
            registers[c] = registers[a] > b ? 1 : 0;
        }
    }, {
        name: 'gtrr',
        run: (registers,a,b,c)=>{
            // gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
            registers[c] = registers[a] > registers[b] ? 1 : 0;
        }
    }, {
        name: 'eqir',
        run: (registers,a,b,c)=>{
            // eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
            registers[c] = a === registers[b] ? 1 : 0
        }
    }, {
        name: 'eqri',
        run: (registers,a,b,c)=>{
            // eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
            registers[c] = registers[a] === b ? 1 : 0
        }
    }, {
        name: 'eqrr',
        run: (registers,a,b,c)=>{
            // eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
            registers[c] = registers[a] === registers[b] ? 1 : 0
        }
    }]

    const opcode = range(ops.length).map(() => ({}));

    const likeThreeOrMore = samples.forEach(sample => {
        ops.forEach(op => {
            const reg = sample.before.slice()
            op.run(reg, sample.a, sample.b, sample.c);
            if (!registerEqual(reg, sample.after)) {
                opcode[sample.opcode][op.name] = false;  
            } else {
                // opcode[sample.opcode][op.name] = false;
            }
        });
    })

    const allNames = ops.map(v => v.name);

    const valids = opcode.map(v => Object.keys(v)).map(v => allNames.filter(n => (v.indexOf(n) === -1)));

    allNames.forEach(n => {
        const resolved = valids.find(v => v.length === 1);
        const resolvedIndex = valids.indexOf(resolved);
        valids[resolvedIndex] = resolved[0];
        valids.forEach((v, index) => {
            if (Array.isArray(v)) {
                valids[index] = v.filter(n => n !== resolved[0])
            }
            return v;
        })
    });

    const opsMap = valids.map(name => ops.find(o => o.name === name));

    console.log(opsMap);

    const instructions = secondPart.split('\n').filter(v => v.length > 0).map(line => {
        const parts = line.split(' ');
        return {
            opcode: parseInt(parts[0], 10),
            a: parseInt(parts[1], 10),
            b: parseInt(parts[2], 10),
            c: parseInt(parts[3], 10),
        }
    })

    const registers = [0, 0, 0, 0];

    instructions.forEach(inst => {
        opsMap[inst.opcode].run(registers, inst.a, inst.b, inst.c);
    })

    console.log(registers);

}
)()
