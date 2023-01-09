const sides = [ 'ab', 'ac', 'ad', 'bc', 'bd', 'cd' ];

export const calcMinExcess = ({ ab, ac, ad, bc, bd, cd }, solver) => {
    const args = { ab, ac, ad, bc, bd, cd };
    let excess = Infinity;
    for (const side of sides) {
        const trueVal = args[side];
        const newArgs = { ...args, [side]: null };
        const results = solver(newArgs);
        const errors = results.map(value => Math.abs(trueVal - value));
        const min = errors.reduce((a, b) => Math.min(a, b), Infinity);
        excess = Math.min(excess, min);
    }
    return excess;
};
