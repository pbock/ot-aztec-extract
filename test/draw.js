'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const draw = require('../lib/draw');

const raws = glob.sync(path.resolve(__dirname, 'private/') + '/*.buf');
const pngs = glob.sync(path.resolve(__dirname, 'private/') + '/*.png');

const testFiles = pngs.map(png => {
	const raw = raws.find(raw => raw.replace(/\.buf$/, '.png') === png);
	return { raw, png };
}).filter(file => file.raw && file.png);

expect(testFiles).to.have.length.greaterThan(0);

describe('extract', function () {
	it('draws a PNG from a raw data buffer', function () {
		testFiles.forEach(( { raw, png } ) => {
			const rawBuffer = fs.readFileSync(raw);
			const expected = fs.readFileSync(png);
			const actual = draw(rawBuffer);
			expect(actual).to.deep.equal(expected);
		})
	})

	it('throws an error when the buffer is null', function () {
		expect(() => draw(null)).to.throw();
	})
})
