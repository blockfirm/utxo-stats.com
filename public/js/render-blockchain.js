var Buffer = require('buffer/').Buffer;
var Promise = require('promise');
var $ = require('jquery');

var config = require('./config');
var renderMagnifier = require('./render-magnifier');

module.exports = function renderBlockchain(id, loadFunction, meta, colorFunction) {
  var block = {};
  var max = 0;
  var maxBlock = 0;

  var promise = new Promise(function (resolve, reject) {
    // Load data.
    loadFunction(function (data) {
      var buf = new Buffer(data, 'base64');
      var length = buf.length / 8;
      var first = buf.readUInt32LE();
      var last = buf.readUInt32LE((length - 1) * 8);

      // Parse block data.
      for (var i = 0; i < length; ++i) {
        var height = buf.readUInt32LE(i * 8);
        var value = buf.readUInt32LE(i * 8 + 4);

        if (value > max) {
          max = value;
          maxBlock = height;
        }

        block[height] = value;
      }

      // Render block data.
      var canvas = document.getElementById(id);
      var context = canvas.getContext('2d');
      var canvasHeight = Math.ceil(meta.height / (config.BLOCKS_PER_ROW/2));

      canvas.height = canvasHeight;
      canvas.style.height = (canvasHeight / 2) + 'px';

      for (var i = 0; i < meta.height; ++i) {
        var value = block[i+1];

        if (value) {
          var row = Math.floor(i / config.BLOCKS_PER_ROW);
          var col = Math.floor(i % config.BLOCKS_PER_ROW);

          context.fillStyle = colorFunction(value, max);
          context.fillRect(col*2, row*2, 2, 2);
        }
      }

      // Attach magnifier events.
      var magnifier = $('#magnifier');

      $(canvas).mousemove(renderMagnifier.bind(null, magnifier, meta, block, max, colorFunction, function (value) {
        if (id === 'utxo-amount') {
          var btc = value / 10000;
          return btc.toFixed(3);
        }

        return value;
      }));

      $(canvas).mouseenter(function () {
        magnifier.show();
      });

      $(canvas).mouseleave(function () {
        magnifier.hide();
      });

      // Resolve promise.
      resolve({
        block: block,
        firstBlock: first,
        lastBlock: last,
        maxBlock: maxBlock
      });
    });
  });

  return promise;
};
