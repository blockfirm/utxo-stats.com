function getMetaData(callback) {
  $.get('/data/meta.json', callback);
}

function getUTXOCount(callback) {
  $.get('/data/map-utxo-count', callback);
}

function getUTXOAmount(callback) {
  $.get('/data/map-utxo-amount', callback);
}

module.exports = {
  getMetaData: getMetaData,
  getUTXOCount: getUTXOCount,
  getUTXOAmount: getUTXOAmount
};
