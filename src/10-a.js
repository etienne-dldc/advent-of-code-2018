(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num => Array(num).fill(null).map((v, i) => i);
    const rangeFrom = (f, t) => range(t - f).map(v => f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    const preEl = document.querySelector('pre');
    const content = preEl.innerText;

    const pointReg = /^position=< ?(?<x>[0-9-]+), ? ?(?<y>[0-9-]+)> velocity=< ?(?<vx>[0-9-]+), ? ?(?<vy>[0-9-]+)>$/
    const points = content.split('\n').filter(v => v).map(p => {
        const match = p.match(pointReg);
        return {
            x: parseInt(match.groups.x, 10),
            y: parseInt(match.groups.y, 10),
            vx: parseInt(match.groups.vx, 10),
            vy: parseInt(match.groups.vy, 10),
        }
    })

    console.log(points)

    const limits = {
        left: Math.min(...points.map(p => p.x)),
        right: Math.max(...points.map(p => p.x)),
        top: Math.min(...points.map(p => p.y)),
        bottom: Math.max(...points.map(p => p.y)),
    }

    const size = Math.max(
        Math.abs(limits.left),
        Math.abs(limits.right),
        Math.abs(limits.top),
        Math.abs(limits.bottom),
    )
    

    preEl.style.display = 'none';

    // cleanup    
    const oldCanvasEl = document.querySelector('canvas');
    if (oldCanvasEl) {
        oldCanvasEl.parentNode.removeChild(oldCanvasEl)
    }
    if (window.cleanup) {
        window.cleanup();
    }

    const canvasEl = document.createElement('canvas');
    canvasEl.style.border = '1px solid grey'

    document.body.style.margin = '0';

    document.body.appendChild(canvasEl);

    const w = 1000;
    const h = 1000;

    const zoom = 500;

    const s = size / zoom;
    const scaleFactor = 1000 / (s * 2);


    console.log(scaleFactor)

    canvasEl.height = w;
    canvasEl.width = h;

    const ctx = canvasEl.getContext('2d');

    let step = 10888;
    let playing = false;

    let stopped = false

    function loop() {
        if (stopped) {
            return;
        }
        if (playing) {
            step++
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);

        const stepPoints = points.map(p => {
            const x = p.x + (p.vx * step);
            const y = p.y + (p.vy * step);
            return { x, y };
        })

        const limits = {
            left: Math.min(...stepPoints.map(p => p.x)),
            right: Math.max(...stepPoints.map(p => p.x)),
            top: Math.min(...stepPoints.map(p => p.y)),
            bottom: Math.max(...stepPoints.map(p => p.y)),
        }

        console.log(limits)

        const width = limits.right - limits.left;
        const height = limits.bottom - limits.top;
        const scale = (1 / Math.max(width / 1000, height / 1000)) * 0.9;

        console.log({ width, height, scale })

        console.log(scale)

        ctx.save();

        ctx.scale(scale, scale)
        ctx.translate(-limits.left * 0.98, -limits.top * 0.98);
        
   

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(limits.left, limits.top, width, height)

        stepPoints.forEach(p => {
            // console.log(p)
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 10 / scale, 0, 2 * Math.PI);
            ctx.fill();
        })

        // ctx.scale(scaleFactor, scaleFactor);
        // ctx.translate(s, s)

        ctx.restore();

        ctx.font = `42px monospace`;
        ctx.fillStyle = 'white';
        ctx.fillText(step, 10, 42);

        if (playing) {
            window.requestAnimationFrame(loop);
        }
    }

    function onKey(event) {
        // console.log(event)
        if (event.code === 'Space') {
            playing = !playing;
            loop();
        }
        if (!playing) {
            const amount = (event.shiftKey ? 10 : (event.altKey ? 0.1 : 1))
            if (event.code === 'ArrowLeft') {
                step -= amount;
                loop();
            }
            if (event.code === 'ArrowRight') {
                step += amount;
                loop();
            } 
        }
    }


    window.cleanup = () => {
        stopped = true;
        document.removeEventListener('keydown', onKey);
    }

    // start
    document.addEventListener('keydown', onKey);
    window.requestAnimationFrame(loop);


})()