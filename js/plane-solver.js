const calcPointC = (ab, ac, bc) => {
	const y = (ab*ab + ac*ac - bc*bc)/(2*ab);
	const x = Math.sqrt(ac*ac - y*y);
	return [ x, y ];
};

const calcDist = (ax, ay, bx, by) => {
	const dx = bx - ax;
	const dy = by - ay;
	return Math.sqrt(dx*dx + dy*dy);
};

export const solveForCd = ({ ab, ac, ad, bc, bd }) => {
	const [ cx, cy ] = calcPointC(ab, ac, bc);
	const [ dx, dy ] = calcPointC(ab, ad, bd);
	return [
		calcDist(cx, cy, dx, dy),
		calcDist(cx, cy, -dx, dy),
	];
};
