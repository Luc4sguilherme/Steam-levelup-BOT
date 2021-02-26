const moment = require('moment');
const axios = require('axios');

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
      method: 'GET',
      baseURL: 'https://steam.supply/API/',
      url: `${steamSupply.apiKey}/update/`,
      params: SteamSupplyData,
    };

    await axios(options);
  }
};

const getCardDB = () =>
  new Promise((resolve, reject) => {
    if (steamSupply.apiKey === '') {
      reject(new Error('Steam.Supply APIKEY its empty!'));
    }

    const options = {
      method: 'GET',
      baseURL: 'https://steam.supply/API/',
      url: `${steamSupply.apiKey}/cardamount`,
    };

    axios(options)
      .then(({ status, data }) => {
        if (status !== 200) {
          log.warn(
            `Failed to request steam.supply database, trying again in a minute.`
          );
          setTimeout(() => {
            resolve(getCardDB());
          }, moment.duration(1, 'minute'));
          return;
        }

        if (typeof data === 'string') {
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
        }

        resolve(JSON.stringify(data));
      })
      .catch(reject);
  });

module.exports = { updateCatalog, getCardDB };
