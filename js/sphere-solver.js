const { sqrt, sin, cos, asin } = Math;

const calcSurfaceDistance = (ax, ay, az, bx, by, bz) => {
	const dx = bx - ax;
	const dy = by - ay;
	const dz = bz - az;
	const chord = sqrt(dx*dx + dy*dy + dz*dz);
	return asin(chord*0.5)*2;
};

const calcPointC = (ab, ac, bc) => {
	const by = sin(ab);
	const bz = cos(ab);
	const cosBc = cos(bc);
	const iby = by*cosBc;
	const ibz = bz*cosBc;
	const m = - ibz/iby;
	const s = iby - ibz*m;
	const z = cos(ac);
	const y = z*m + s;
	const sinAc = sin(ac);
	const x = sqrt(sinAc*sinAc - y*y);
	return [ x, y, z ];
};

export const solveForCd = ({ ab, ac, ad, bc, bd }) => {
	const [ cx, cy, cz ] = calcPointC(ab, ac, bc);
	const [ dx, dy, dz ] = calcPointC(ab, ad, bd);
	return [
		calcSurfaceDistance(cx, cy, cz, dx, dy, dz),
		calcSurfaceDistance(cx, cy, cz, -dx, dy, dz),
	]
};
