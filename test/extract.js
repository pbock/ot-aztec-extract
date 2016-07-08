'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const extract = require('../lib/extract');

const pdfs = glob.sync(path.resolve(__dirname, 'private/') + '/*.pdf');
const raws = glob.sync(path.resolve(__dirname, 'private/') + '/*.buf');

const testFiles = pdfs.map(pdf => {
	const raw = raws.find(raw => raw.replace(/\.buf$/, '.pdf') === pdf);
	return { raw, pdf };
}).filter(file => file.raw && file.pdf);

expect(testFiles).to.have.length.greaterThan(0);

describe('extract', function () {
	it('extracts the aztec code from a DB Online Ticket and returns a buffer of the raw data', function () {
		const promises = testFiles.map(( { raw, pdf } ) => {
			const pdfBuffer = fs.readFileSync(pdf);
			let expected = fs.readFileSync(raw);
			if (expected.length === 4 && expected.toString() === 'null') expected = null;
			const actual = extract(pdfBuffer);
			return expect(actual).to.become(expected);
		})

		return Promise.all(promises);
	})
})
