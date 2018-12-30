(() => {

    let content = document.querySelector('pre').innerHTML;

    let lines = content.split('\n').filter(v => v.length > 0);

    console.log(`Lines count: ${lines.length}`)


    lines.forEach((line, index) => {
        lines.forEach((oLine, oIndex) => {
            if (index === oIndex) {
                return;
            }
            let letterDiffIndex = null
            for (var i = 0; i < line.length; i++) {
                let letter = line[i];
                let oLetter = oLine[i];
                if (letter === oLetter) {
                    continue;
                }
                if (letterDiffIndex !== null) {
                    break
                }
                letterDiffIndex = i;
            }
            if (letterDiffIndex !== null && i === line.length) {
                console.log({ index, oIndex, line, oLine, letterDiffIndex })
            }
        })
    })


})()