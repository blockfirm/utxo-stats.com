var Buffer = require('buffer/').Buffer;
var moment = require('moment');

function loadMetaData(callback) {
  $.get('/data/meta.json', callback);
}

function loadUTXOCount(callback) {
  $.get('/data/map-utxo-count', callback);
}

function loadUTXOAmount(callback) {
  $.get('/data/map-utxo-amount', callback);
}

function drawChart(id, loadFunction, meta, colorFunction) {
  var block = {};
  var max = 0;

  loadFunction(function (data) {
    var buf = new Buffer(data, 'base64');
    var length = buf.length / 8;

    for (var i = 0; i < length; ++i) {
      var height = buf.readUInt32LE(i * 8);
      var value = buf.readUInt32LE(i * 8 + 4);

      if (value > max) {
        max = value;
      }

      block[height] = value;
    }

    var c = document.getElementById(id);
    var ctx = c.getContext('2d');

    for (var i = 0; i < meta.height; ++i) {
      var value = block[i+1];

      if (value) {
        var row = Math.floor(i / 504);
        var col = Math.floor(i % 504);

        ctx.fillStyle = colorFunction(value, max);
        ctx.fillRect(col*2, row*2, 2, 2);
      }
    }
  });
}

$(function () {
  loadMetaData(function (meta) {
    $('#updated-at').text(
      moment(meta.updated_at * 1000).format('MMMM DD YYYY, kk:mm')
    );

    drawChart('utxo-count', loadUTXOCount, meta, function (value, max) {
      return 'rgba(247, 147, 26, ' + (value / max) * 30 + ')';
    });

    drawChart('utxo-amount', loadUTXOAmount, meta, function (value, max) {
      return 'rgba(0, 184, 255, ' + (value / max) / 1.1 + ')';
    });
  });
});
