var $ = require('jquery');

function getTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function getMetaData(callback) {
  $.get('/data/meta.json?t=' + getTimestamp(), callback);
}

function getUTXOCount(callback) {
  $.get('/data/map-utxo-count?t=' + getTimestamp(), callback);
}

function getUTXOAmount(callback) {
  $.get('/data/map-utxo-amount?t=' + getTimestamp(), callback);
}

module.exports = {
  getMetaData: getMetaData,
  getUTXOCount: getUTXOCount,
  getUTXOAmount: getUTXOAmount
};
