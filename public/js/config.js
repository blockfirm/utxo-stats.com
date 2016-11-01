module.exports = {
  BLOCKS_PER_ROW: 300,

  utxoCountColor: function (value, max) {
    return 'rgba(247, 147, 26, ' + (value / max) * 30 + ')';
  },

  utxoAmountColor: function (value, max) {
    return 'rgba(0, 184, 255, ' + (value / max) * 100 + ')';
  }
};
