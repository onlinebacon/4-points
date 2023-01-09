import { solvePlanar, solveSpherical } from './solver.js';
import { calcMinExcess } from './min-excess.js';

const radius = 6371.0088e3;
const meter = 1;
const mile = 1609.344;
const nauticalMile = 2*Math.PI*radius/360/60;
const radiansPerDeg = Math.PI/180;
const radiansPerMi = mile/radius;
const radiansPerM = meter/radius;
const radiansPerNm = nauticalMile/radius;

const toRadians = (value, unit) => {
	if (unit === 'deg') return value*radiansPerDeg;
	if (unit === 'mi') return value*radiansPerMi;
	if (unit === 'm') return value*radiansPerM;
	if (unit === 'nm') return value*radiansPerNm;
};

const fromRadians = (value, unit) => {
	if (unit === 'deg') return value/radiansPerDeg;
	if (unit === 'mi') return value/radiansPerMi;
	if (unit === 'm') return value/radiansPerM;
	if (unit === 'nm') return value/radiansPerNm;
};

const geometrySelect = document.querySelector('#geometry');
const unitSelect = document.querySelector('#unit');
const inputs = [ ...document.querySelectorAll('[name]') ];
const excessSpan = document.querySelector('#excess');

const geometrySolverMap = {
	'planar':    solvePlanar,
	'spherical': solveSpherical,
};

const parseArgsUnits = (args, unit) => {
	const res = {};
	for (const key in args) {
		const value = args[key];
		if (value == null) continue;
		res[key] = toRadians(args[key], unit);
	}
	return res;
};

const getArgs = () => {
	const entries = inputs.map(input => {
		const value = input.value.trim();
		const name = input.getAttribute('name');
		return [ name, value == '' ? null : Number(value) ];
	});
	const count = entries.filter(entry => entry[1] !== null).length;
	const args = Object.fromEntries(entries);
	return { args, count };
};

const updateExcess = () => {
	const { args, count } = getArgs();
	if (count !== 6) return;
	const solver = geometrySolverMap[geometrySelect.value];
	if (solver === solveSpherical) {
		const unit = unitSelect.value;
		const parsedArgs = parseArgsUnits(args, unit);
		const excess = fromRadians(calcMinExcess(parsedArgs, solver), unit);
		excessSpan.innerText = excess;
	} else {
		const excess = calcMinExcess(args, solver);
		excessSpan.innerText = excess;
	}
};

inputs.forEach(input => {
	input.addEventListener('input', updateExcess);
});

unitSelect.addEventListener('input', updateExcess);
geometrySelect.addEventListener('input', updateExcess);

let chosenIndex = 0;

const calcButtons = [ ...document.querySelectorAll('.calc') ];
calcButtons.forEach(calc => {
	const input = calc.parentElement.querySelector('input');
	const name = input.getAttribute('name');
	calc.addEventListener('click', () => {
		let { args } = getArgs();
		const solver = geometrySolverMap[geometrySelect.value];
		const unit = unitSelect.value;
		if (solver === solveSpherical) {
			args = parseArgsUnits(args, unit);
		}
		args = { ...args, [name]: null };
		let ans = solver(args);
		if (solver === solveSpherical) {
			ans = ans.map(val => fromRadians(val, unit));
		}
		input.value = ans[chosenIndex];
		chosenIndex ^= 1;
		updateExcess();
	});
});

updateExcess();
