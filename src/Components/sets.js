/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const fs = require('graceful-fs');

const log = require('./log');
const main = require('../Config/main');
const steamSupply = require('./steamSupply');

const maxSets = (cardsFromSortedInventory) => {
  let cardCounts = _.mapValues(
    cardsFromSortedInventory,
    (cardsArray) => cardsArray.length
  );
  cardCounts = Object.keys(cardCounts).map((key) => cardCounts[key]);
  return Math.min(...cardCounts);
};

const updateCardsDB = () => {
  steamSupply
    .getCardDB()
    .then((data) => {
      fs.writeFileSync('./Data/Sets/set_data.json', data);
    })
    .catch((error) => {
      log.error(`An error occurred while updating cardsDB: ${error}`);
    });
};

const parseCardsData = (data) => {
  const db = JSON.parse(data);
  const sets = {};

  for (const appId in db) {
    sets[appId] = {
      appid: appId,
      count: db[appId],
    };
  }

  return sets;
};

const getCardsInSets = (callback) => {
  const dir = './Data/Sets/set_data.json';
  if (main.steamSupply.updateCardDB && !fs.existsSync(dir)) {
    steamSupply
      .getCardDB()
      .then((data) => {
        const sets = parseCardsData(data);

        fs.writeFileSync(dir, data);

        callback(null, sets);
      })
      .catch((error) => {
        callback(error);
      });
  } else {
    fs.readFile(dir, 'utf8', (err, data) => {
      if (err) {
        callback(err);
      } else {
        const sets = parseCardsData(data);
        callback(null, sets);
      }
    });
  }
};

const getSets = (INV, DATA, callback) => {
  const s = {};
  _.forOwn(INV, (c, id) => {
    const uc = Object.keys(c).length;
    if (DATA[id.toString()] && uc === DATA[id.toString()].count) {
      const r = maxSets(c);
      s[id.toString()] = [];
      for (let i = 0; i < r; i += 1) {
        const set = [];
        _.forOwn(c, (e) => {
          set.push(e[i]);
        });
        s[id.toString()].push(set);
      }
    } else if (!DATA[id.toString()]) {
      log.warn(`Card set non-existent, skipping it ${id.toString()} `);
    }
  });
  callback(null, s);
};

module.exports = {
  getCardsInSets,
  getSets,
  updateCardsDB,
};
