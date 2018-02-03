const fs = require('fs');
const path = require('path');
const Client = require('bitcoin-core');

const APP_DIR = path.dirname(require.main.filename);
const UPDATE_INTERVAL = 60 * 1000 * 5; // Every 5 minutes

const client = new Client({
  username: process.env.BITCOIN_USERNAME,
  password: process.env.BITCOIN_PASSWORD,
  timeout: 60 * 1000 * 5 // 5 minutes
});

let lastBlockHeight = 0;

const getBlockCount = () => {
  return client.command('getblockcount');
};

const getUTXOStats = () => {
  return client.command('gettxoutsetinfo', true); // blockmap = true
};

const saveUTXOStats = (stats) => {
  const now = Math.floor(new Date().getTime() / 1000);

  const meta = {
    updated_at: now
  };

  Object.keys(stats).forEach((key) => {
    if (key === 'map_utxo_count' || key === 'map_utxo_amount') {
      return;
    }

    meta[key] = stats[key];
  });

  fs.writeFileSync(`${APP_DIR}/public/data/map-utxo-count`, stats.map_utxo_count);
  fs.writeFileSync(`${APP_DIR}/public/data/map-utxo-amount`, stats.map_utxo_amount);
  fs.writeFileSync(`${APP_DIR}/public/data/meta.json`, JSON.stringify(meta));
};

const checkUTXOStats = () => {
  getBlockCount()
    .then((blockHeight) => {
      if (blockHeight === lastBlockHeight) {
        return;
      }

      lastBlockHeight = blockHeight;

      console.log(`Processing stats for block ${blockHeight}...`);

      return getUTXOStats().then((stats) => {
        console.log('  Saving data...');
        saveUTXOStats(stats);
        console.log('  Done');
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

setInterval(checkUTXOStats, UPDATE_INTERVAL);
