(()=>{

    console.clear();

    const inverseCase = v=>v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num=>Array(num).fill(null).map((v,i)=>i);
    const rangeFrom = (f,t)=>range(t - f).map(v=>f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    let content = `#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5`

    content = document.querySelector('pre').innerText;

    const lines = content.split('\n').filter(v => v.length > 0);

    // remove ip line
    const ip = parseInt(lines.shift().split(' ')[1], 0);

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

    const instructions = lines.map(line => {
        const parts = line.split(' ');
        return {
            opcode: parts[0],
            a: parseInt(parts[1], 10),
            b: parseInt(parts[2], 10),
            c: parseInt(parts[3], 10),
        }
    })

    const registers = [0, 0, 0, 0, 0, 0];

    const instructionsLength = instructions.length;

    console.log(ip, instructions)

    let safe = 10000000;

    while(registers[ip] >= 0 && registers[ip] < instructionsLength && safe > 0) {
        safe--;
        const nextOp = instructions[registers[ip]];
        const run = ops.find(o => o.name === nextOp.opcode).run;
        run(registers, nextOp.a, nextOp.b, nextOp.c);
        registers[ip]++
    }

    if (safe <= 0) {
        console.log('hit safe !');
    }

    registers[ip]--

    console.log(registers)

    

}
)()
