(() => {

    let content = document.querySelector('pre').innerHTML;

    let steps = content.split('\n').filter(v => v.length > 0).map(v => parseInt(v, 10));

    let sum = steps.reduce((acc, item) => acc + item, 0);

    console.log(sum);

})()