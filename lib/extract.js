'use strict';

const zlib = require('zlib');

const streamStart = Buffer.from('stream\n');
const streamEnd = Buffer.from('\nendstream');

function inflate(buffer) {
	return new Promise((resolve, reject) => {
		zlib.inflate(buffer, (err, inflated) => {
			if (err) return reject(err);
			resolve(inflated);
		})
	})
}

function extract(pdf) {
	let cursor = 0;
	const search = Buffer.from('/Image');

	while (cursor < pdf.length) {
		const index = pdf.indexOf(search, cursor);
		if (index === -1) break;

		cursor = index + 1;
		const endOfMetadata = pdf.indexOf('stream', index);
		const metadata = pdf.slice(index, endOfMetadata).toString();
		let width, height;
		try {
			width = +metadata.match(/\/Width (\d+)/)[1];
			height = +metadata.match(/\/Height (\d+)/)[1];
		} catch (e) {
			if (!e instanceof TypeError) throw e;
			else continue;
		}

		// Aztec codes are always encoded at 332x332px
		if (width === 332 && height === 332) {
			const start = pdf.indexOf(streamStart, index) + streamStart.length;
			const end = pdf.indexOf(streamEnd, index);
			const deflated = pdf.slice(start, end);

			return inflate(deflated);
		}
	}
	return Promise.resolve(null);
}

module.exports = extract;
