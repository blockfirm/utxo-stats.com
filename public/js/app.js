var Vue = require('./vue');
var moment = require('moment');
var Promise = require('promise');

var config = require('./config');
var blockYears = require('./block-years');
var data = require('./data');
var renderBlockchain = require('./render-blockchain');
var throttle = require('./throttle');
var scrollToBottom = require('./scroll-to-bottom');

window.app = new Vue({
  el: '#app',
  data: {
    BLOCKS_PER_ROW: config.BLOCKS_PER_ROW,

    meta: { txouts: 0, total_amount: 0 },
    count: { max: { value: 0 }, first: { value: 0 }, last: { value: 0 } },
    amount: { max: { value: 0 }, first: { value: 0 }, last: { value: 0 } },

    blockYears: blockYears,

    isAtTop: true,
    isAtBottom: false,

    height: 0,
    value: 0,

    loaded: false
  }
});

function renderBlockchains(meta) {
  var promises = [];

  promises[0] = renderBlockchain('utxo-count', data.getUTXOCount, meta, config.utxoCountColor).then(function (info) {
    app.count = {
      max: {
        height: info.maxBlock,
        value: info.block[info.maxBlock]
      },
      first: {
        height: info.firstBlock,
        value: info.block[info.firstBlock]
      },
      last: {
        height: info.lastBlock,
        value: info.block[info.lastBlock]
      }
    };
  });

  promises[1] = renderBlockchain('utxo-amount', data.getUTXOAmount, meta, config.utxoAmountColor).then(function (info) {
    app.amount = {
      max: {
        height: info.maxBlock,
        value: info.block[info.maxBlock] / 10000
      },
      first: {
        height: info.firstBlock,
        value: info.block[info.firstBlock] / 10000
      },
      last: {
        height: info.lastBlock,
        value: info.block[info.lastBlock] / 10000
      }
    };
  });

  Promise.all(promises).then(function () {
    app.loaded = true;
    scrollToBottom();
  });
}

data.getMetaData(function (meta) {
  meta.updated_at_formatted = moment(meta.updated_at * 1000).format('MMMM DD YYYY, kk:mm');
  app.meta = meta;

  // Let fonts etc. render before we render the blockchains.
  setTimeout(function () {
    renderBlockchains(meta);
  }, 20);
});

$(document).scroll(throttle(10, function () {
  var scrollTop = $(document).scrollTop();
  var pageHeight = $(document).height() - $(window).height();
  var isAtTop = scrollTop <= 0;
  var isAtBottom = scrollTop >= pageHeight;

  if (app.isAtTop !== isAtTop) {
    app.isAtTop = isAtTop;
  }

  if (app.isAtBottom !== isAtBottom) {
    app.isAtBottom = isAtBottom;
  }
}));
