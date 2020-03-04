'use strict';

export function rgbToHex({ r, g, b }) {
	let newR = r.toString(16);
	let newG = g.toString(16);
	let newB = b.toString(16);

	if (newR.length === 1) newR = `0${newR}`;
	if (newG.length === 1) newG = `0${newG}`;
	if (newB.length === 1) newB = `0${newB}`;

	return `0x${newR}${newG}${newB}`;
}
