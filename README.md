# ot-aztec-extract

A single-purpose module that extracts the Aztec code from Deutsche Bahn's PDF online tickets and spits them out as PNGs. Not meant for or tested on other documents. It only fits this one very specific use case.

## Dependencies

Relies on [canvas][canvas], which in turn needs Cairo.

The barcode image is monochrome, with one bit per pixel (`0` for black, `1` for white). This means that it's easy to extract a perfect representation of the code, which in turn makes it fairly easy to read the barcode natively with no need for any image correction/computer vision, completely forgoing the need for both Canvas/Cairo and zxing, both of which are expensive. Unfortunately, I don't have the knowledge/patience to write an Aztec code reader myself, so we'll need to draw an image to feed into zxing for now.

## Usage

Exports just one function.

```js
const extractAztec = require('ot-aztec-extract');
extractAztec(fs.readFileSync('online-ticket.pdf'))
	.then(png => fs.writeFileSync('aztec-code.png'));
```

Accepts a buffer of raw PDF data.

Returns a promise that resolves with a buffer of PNG data if a suitable code was found or rejects when none was found.

## Licence

MIT

[canvas]: https://github.com/Automattic/node-canvas
