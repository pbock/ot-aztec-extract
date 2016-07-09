'use strict';

const Canvas = require('canvas');

// A DB Aztec code is always 83 "data pixels" each side, each of them occupying
// 4x4 image pixels

// Expected, therefore, would be a buffer with 83 * 4 * 83 * 4 / 8 = 13778 bytes
// Actually, buffers turn out to have 14276 bytes, i.e. 498 bytes too many


function rawDataToPNG(raw) {
	const { length } = raw;
	const actualWidth = 86 * 4;
	const expectedWidth = 83 * 4;
	console.log(length);

	const canvas = new Canvas(expectedWidth, expectedWidth);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, expectedWidth, expectedWidth);
	let pixels = 83 * 2;

	let outbuffer = Buffer.alloc(length * 8);

	ctx.fillStyle = '#000';
	for (let cursor = 0; cursor < raw.length; cursor++) {
		let byte = raw[cursor];

		for (let i = 0; i < 8; i++) {
			const x = pixels % actualWidth;
			const y = pixels / actualWidth | 0;
			const bit = byte >> 7;
			byte = byte << 1;
			if (bit) ctx.fillRect(x, y, 1, 1);
			outbuffer[pixels] = bit ? 0x5f : 0x4d;
			++pixels;
		}
	}

	require('fs').writeFileSync('testbuf', outbuffer);

	return canvas.toBuffer();
}

module.exports = rawDataToPNG;
