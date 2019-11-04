export function RGB2HEX(r, g, b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);

	if (r.length == 1) r = "0" + r;
	if (g.length == 1) g = "0" + g;
	if (b.length == 1) b = "0" + b;

	return "0x" + r + g + b;
}

export function toDegree(rad) {
	return (rad * 180) / Math.PI;
}
