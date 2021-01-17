const moment = require('moment');
const request = require('request-promise');

const { steamSupply, maxStock, maxBuy } = require('../Config/main.js');
const rates = require('../Config/rates.js');
const log = require('./log.js');

const updateCatalog = async (
  hydraKeysQuantity = 0,
  csgoKeysQuantity = 0,
  tf2KeysQuantity = 0,
  gemsQuantity = 0
) => {
  if (steamSupply.apiKey === '') {
    throw new Error('Steam.Supply API its empty!');
  } else {
    const SteamSupplyData = {};

    // Bot Setup Data
    SteamSupplyData.maxTradeKeys = maxBuy;
    SteamSupplyData.maxStock = maxStock;

    // Inventory Amount
    SteamSupplyData.hydraamount = hydraKeysQuantity;
    SteamSupplyData.csgoamount = csgoKeysQuantity;
    SteamSupplyData.tf2amount = tf2KeysQuantity;
    SteamSupplyData.gemamount = gemsQuantity;

    // Sell Rate
    SteamSupplyData.hydrarate = rates.hydra.sell;
    SteamSupplyData.csgorate = rates.csgo.sell;
    SteamSupplyData.tf2rate = rates.tf.sell;
    SteamSupplyData.gemrate = rates.gems.sell;

    // Buy Rate
    SteamSupplyData.hydrabuyrate = rates.hydra.buy;
    SteamSupplyData.csgobuyrate = rates.csgo.buy;
    SteamSupplyData.tf2buyrate = rates.tf.buy;
    SteamSupplyData.gembuyrate = rates.gems.buy;

    const options = {
      baseUrl: 'https://steam.supply/API/',
      uri: `${steamSupply.apiKey}/update/`,
      qs: SteamSupplyData,
    };

    await request(options);
  }
};

const getCardDB = () => {
  return new Promise((resolve, reject) => {
    if (steamSupply.apiKey === '') {
      reject(new Error('Steam.Supply APIKEY its empty!'));
    }

    request.get(
      `https://steam.supply/API/${steamSupply.apiKey}/cardamount`,
      {
        json: true,
      },
      (err, res, data) => {
        if (err || res.statusCode !== 200) {
          log.warn(
            `Failed to request steam.supply database, trying again in a minute.`
          );
          setTimeout(() => {
            resolve(getCardDB());
          }, moment.duration(1, 'minute'));
          return;
        }

        if (
          data.indexOf('Missing api type or key') > -1 ||
          data.indexOf('you are not paid.') > -1 ||
          data.indexOf('API key not found') > -1
        ) {
          reject(
            new Error(
              'Your steam.supply api its not correct, or you its not featured.'
            )
          );
        }

        resolve(data.trim());
      }
    );
  });
};

module.exports = { updateCatalog, getCardDB };
