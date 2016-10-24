var fs = require('fs');
var path = require('path');
var Client = require('bitcoin-core');

var appDir = path.dirname(require.main.filename);

var client = new Client({
  username: process.env.BITCOIN_USERNAME,
  password: process.env.BITCOIN_PASSWORD,
  timeout: 60 * 1000 * 5
});

function getUTXOStats() {
  return client.command('gettxoutsetinfo', true);
}

function saveUTXOStats(stats) {
  var meta = {
    updated_at: Math.floor(new Date().getTime() / 1000)
  };

  Object.keys(stats).forEach(function (key) {
    if (key === 'map_utxo_count' || key === 'map_utxo_amount') {
      return;
    }

    meta[key] = stats[key];
  });

  fs.writeFileSync(appDir + '/public/data/map-utxo-count', stats.map_utxo_count);
  fs.writeFileSync(appDir + '/public/data/map-utxo-amount', stats.map_utxo_amount);
  fs.writeFileSync(appDir + '/public/data/meta.json', JSON.stringify(meta));
}

//setInterval(function () {
  getUTXOStats().then(function (stats) {
    saveUTXOStats(stats);
  }).catch(function (err) {
    console.error(err);
  });
//}, 60 * 1000 * 10);
