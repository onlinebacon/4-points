import * as Planar from './plane-solver.js';
import * as Spherical from './sphere-solver.js';

const sides = [ 'ab', 'ac', 'ad', 'bc', 'bd', 'cd' ];

const sort = {
	ab: 'ab', ac: 'ac', ad: 'ad', bc: 'bc', bd: 'bd', cd: 'cd',
	ba: 'ab', ca: 'ac', da: 'ad', cb: 'bc', db: 'bd', dc: 'cd',
};

const swapAndSolve = (args, dict, cdSolver) => {
	const translated = {};
	for (const side of sides) {
		const newSide = sort[side.split('').map(p => dict[p] ?? p).join('')];
		translated[newSide] = args[side];
	}
	return cdSolver(translated);
};

const solve = ({ ab, ac, ad, bc, bd, cd }, cdSolver) => {
	const args = { ab, ac, ad, bc, bd, cd };
	const missing = sides.find(side => args[side] == null);
	if (missing == 'cd') return cdSolver(args);
	const [ p1, p2 ] = missing.split('');
	if (p1 === 'c') return swapAndSolve(args, { [p2]: 'd', d: p2 }, cdSolver);
	if (p2 === 'c') return swapAndSolve(args, { [p1]: 'd', d: p1 }, cdSolver);
	if (p2 === 'd') return swapAndSolve(args, { [p1]: 'c', c: p1 }, cdSolver);
	return swapAndSolve(args, { [p1]: 'c', c: p1, [p2]: 'd', d: p2 }, cdSolver);
};

const validateArgs = (args) => {
	const entries = Object.entries(args);
	const valid = entries.filter(entry => sides.includes(entry[0]) && entry[1] != null);
	const count = valid.length;
	if (count !== 5) throw new Error('Exactly 5 sides are required');
};

export const solvePlanar = ({ ab, ac, ad, bc, bd, cd }) => {
	const args = { ab, ac, ad, bc, bd, cd };
	validateArgs(args);
	return solve(args, Planar.solveForCd);
};

export const solveSpherical = ({ ab, ac, ad, bc, bd, cd }) => {
	const args = { ab, ac, ad, bc, bd, cd };
	validateArgs(args);
	return solve(args, Spherical.solveForCd);
};
