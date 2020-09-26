const _ = require('lodash');
const fs = require('fs');
const log = require('./log');

const maxSets = (cardsFromSortedInventory) => {
  let cardCounts = _.mapValues(
    cardsFromSortedInventory,
    (cardsArray) => cardsArray.length
  );
  cardCounts = Object.keys(cardCounts).map((key) => cardCounts[key]);
  return Math.min(...cardCounts);
};

const getCardsInSets = (callback) => {
  fs.readFile('./Data/Sets/set_data.json', 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      const c = JSON.parse(data);
      const d = {};
      for (let i = 0; i < c.sets.length; i += 1) {
        d[c.sets[i].appid] = {
          appid: c.sets[i].appid,
          name: c.sets[i].game,
          count: c.sets[i].normal.count,
        };
      }
      callback(null, d);
    }
  });
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
};
