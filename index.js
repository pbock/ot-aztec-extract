'use strict';

const extract = require('./lib/extract');
const draw = require('./lib/draw');

module.exports = function (pdf) {
	return extract(pdf).then(draw);
}
