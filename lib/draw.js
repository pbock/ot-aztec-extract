'use strict';

const Canvas = require('canvas');

// A DB Aztec code is always 83 "data readPixels" each side, each of them occupying
// 4x4 image readPixelss

// Expected, therefore, would be a buffer with 83 * 4 * 83 * 4 / 8 = 13778 bytes
// Actually, buffers turn out to have 14276 bytes, i.e. 498 bytes too many

// It turns out that rows start with a null byte and end with half a null byte
// that we'll need to discard

function draw(raw) {
	const bytesPerRow = 43;
	const expectedWidth = 83 * 4;

	const canvas = new Canvas(expectedWidth, expectedWidth);
	const ctx = canvas.getContext('2d');
	const imageData = ctx.getImageData(0, 0, expectedWidth, expectedWidth);
	const { data } = imageData;

	let writtenPixels = 0;

	for (let cursor = 0; cursor < raw.length; cursor++) {
		let byte = raw[cursor];

		for (let i = 0; i < 8; i++) {
			const bit = (byte & 0b10000000) >> 7;
			const bitInRow = (cursor % bytesPerRow) * 8 + i;
			byte = byte << 1;

			if (bitInRow > 7 && bitInRow < bytesPerRow * 8 - 4) {
				data[writtenPixels * 4] = bit * 255;
				data[writtenPixels * 4 + 1] = bit * 255;
				data[writtenPixels * 4 + 2] = bit * 255;
				data[writtenPixels * 4 + 3] = 255;
				++writtenPixels;
			}
		}
	}
	ctx.putImageData(imageData, 0, 0);

	return canvas.toBuffer();
}

module.exports = draw;
