(() => {

    console.clear();

    const inverseCase = v => v.toUpperCase() === v ? v.toLowerCase() : v.toUpperCase();
    const range = num => Array(num).fill(null).map((v, i) => i);
    const rangeFrom = (f, t) => range(t - f).map(v => f + v);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    const input = 760221;

    const positions = [0, 1];
    const recipes = [3, 7];

    const max = input + 10;

    while (recipes.length < max) {
        let next = positions.map(pos => recipes[pos]).reduce((acc, i) => acc + i, 0);
        const newRecipes = [];
        if (next === 0) {
            newRecipes.push(0)
        } else {
           while (next > 0) {
                const newOne = next % 10;
                newRecipes.unshift(newOne);
                next = (next - newOne) / 10
            }
        }

        recipes.push(...newRecipes);
        positions.forEach((pos, index) => {
            positions[index] = (pos + recipes[pos] + 1) % recipes.length;
        });
    }

    // console.log(recipes)
    console.log(recipes.slice(input, max))

})()