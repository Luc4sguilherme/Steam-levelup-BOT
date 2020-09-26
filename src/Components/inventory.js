/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */

const _ = require('lodash');
const async = require('async');
const moment = require('moment');

const acceptedKeys = require('../Config/keys.js');
const utils = require('../Utils/utils');
const rates = require('../Config/rates.js');
const { getSets } = require('./sets.js');
const log = require('./log');

const inventory = {};

inventory.loading = 0;
inventory.botSets = {};
inventory.stock = {
  totalBotSets: 0,
  csKeys: {
    tradable: 0,
    notradable: 0,
  },
  tfKeys: {
    tradable: 0,
    notradable: 0,
  },
  hydraKeys: {
    tradable: 0,
    notradable: 0,
  },
  gemsQuantity: {
    tradable: 0,
    notradable: 0,
  },
};

inventory.play = (client) => {
  const playThis = ['', true];
  playThis[0] = `${inventory.stock.totalBotSets} Sets ► ${rates.csgo.sell}:1 CS:GO ► ${rates.tf.sell}:1 TF2 ► 1:${rates.gems.sell} Gems`;
  client.gamesPlayed(playThis);
};

inventory.loadInventory = (
  client,
  community,
  allCards,
  load,
  playLoading,
  callback
) => {
  const SID = client.steamID.getSteamID64();
  const startedTime = Date.now();
  inventory.loading += 1;
  playLoading.resetTimer();
  playLoading.startTimer(client);
  const Inventory = {
    GEMS: (callback) => {
      inventory.loadGEMS(SID, community, (ERR) => {
        if (ERR) {
          return setTimeout(() => {
            Inventory.GEMS(callback);
          }, moment.duration(5, 'seconds'));
        }
        callback(null, true);
      });
    },
    CSGO: (callback) => {
      inventory.loadCSGO(SID, community, (ERR) => {
        if (ERR) {
          return setTimeout(() => {
            Inventory.CSGO(callback);
          }, moment.duration(5, 'seconds'));
        }
        callback(null, true);
      });
    },
    HYDRA: (callback) => {
      inventory.loadHYDRA(SID, community, (ERR) => {
        if (ERR) {
          return setTimeout(() => {
            Inventory.HYDRA(callback);
          }, moment.duration(5, 'seconds'));
        }
        callback(null, true);
      });
    },
    TF2: (callback) => {
      inventory.loadTF(SID, community, (ERR) => {
        if (ERR) {
          return setTimeout(() => {
            Inventory.TF2(callback);
          }, moment.duration(5, 'seconds'));
        }
        callback(null, true);
      });
    },
    SETS: (callback) => {
      setTimeout(() => {
        inventory.loadSETS(SID, community, allCards, (ERR) => {
          if (ERR) {
            return setTimeout(() => {
              Inventory.SETS(callback);
            }, moment.duration(5, 'seconds'));
          }
          callback(null, true);
        });
      }, moment.duration(3, 'seconds'));
    },
  };

  const LoadInventories = {};
  for (let i = 0; i < Object.keys(load).length; i += 1) {
    LoadInventories[i] = Inventory[load[i]];
  }

  async.series(LoadInventories, () => {
    playLoading.resetTimer();
    inventory.loading -= 1;
    log.warn(
      `Inventory loaded in ${moment().diff(
        startedTime,
        'seconds',
        true
      )} seconds!`
    );
    if (callback) callback(true);
  });
};

inventory.updateStock = (offer, client, community, allCards) => {
  let j = 0;
  const load = {};

  function add(param) {
    // eslint-disable-next-line no-plusplus
    load[j++] = param; 
  }
  if ((offer.data('amountofgems')) > 0) {
    add('GEMS');
  }
  if ((offer.data('commandused')).search(/CSGO/) !== -1) {
    add('CSGO');
  }
  if ((offer.data('commandused')).search(/TF/) !== -1) {
    add('TF2');
  }
  if ((offer.data('amountofsets')) > 0 || (offer.data('amountofleftovers')) > 0) {
    add('SETS');
  }
  if ((offer.data('commandused')).search(/HYDRA/) !== -1) {
    add('HYDRA');
  }
  if (Object.keys(load).length !== 0) {
    inventory.loadInventory(
      client,
      community,
      allCards,
      load,
      utils.playLoading,
      () => {
        inventory.play(client);
      }
    );
  }
};

inventory.getInventory = (SID, community, callback) => {
  community.getUserInventoryContents(SID, 753, 6, true, (ERR, INV) => {
    if (ERR) {
      callback(ERR);
    } else {
      const newInv = INV.filter(
        (ITEM) => ITEM.getTag('item_class').internal_name === 'item_class_2'
      ).filter(
        (ITEM) => ITEM.getTag('cardborder').internal_name === 'cardborder_0'
      );

      let sInventory = newInv;
      sInventory = _.groupBy(
        sInventory,
        (CEconItem) => CEconItem.market_hash_name.split('-')[0]
      );

      _.forOwn(sInventory, function (CEconItemArray, appid) {
        sInventory[appid] = _.groupBy(CEconItemArray, 'classid');
      });
      callback(null, sInventory);
    }
  });
};

inventory.loadCSGO = (SID, community, callback) => {
  community.getUserInventoryContents(SID, 730, 2, false, (ERR, INV) => {
    if (!ERR) {
      inventory.stock.csKeys.tradable = 0;
      inventory.stock.csKeys.notradable = 0;
      for (let i = 0; i < INV.length; i += 1) {
        if (acceptedKeys.csgo.indexOf(INV[i].market_hash_name) >= 0) {
          if (INV[i].tradable) {
            inventory.stock.csKeys.tradable += 1;
          } else {
            inventory.stock.csKeys.notradable += 1;
          }
        }
      }
      log.warn(
        `Bot's CSGO loaded: ${inventory.stock.csKeys.tradable} tradable, ${inventory.stock.csKeys.notradable} notradable.`
      );
      callback();
    } else {
      log.error(`An error occurred while getting bot CSGO inventory: ${ERR}`);
      callback(ERR);
    }
  });
};

inventory.loadHYDRA = (SID, community, callback) => {
  community.getUserInventoryContents(SID, 730, 2, false, (ERR, INV) => {
    if (!ERR) {
      inventory.stock.hydraKeys.tradable = 0;
      inventory.stock.hydraKeys.notradable = 0;
      for (let i = 0; i < INV.length; i += 1) {
        if (acceptedKeys.hydra.indexOf(INV[i].market_hash_name) >= 0) {
          if (INV[i].tradable) {
            inventory.stock.hydraKeys.tradable += 1;
          } else {
            inventory.stock.hydraKeys.notradable += 1;
          }
        }
      }
      log.warn(
        `Bot's Hydra loaded: ${inventory.stock.hydraKeys.tradable} tradable, ${inventory.stock.hydraKeys.notradable} notradable.`
      );
      callback();
    } else {
      log.error(
        `An error occurred while getting bot HYDRA inventory: ${ERR}`
      );
      callback(ERR);
    }
  });
};

inventory.loadTF = (SID, community, callback) => {
  community.getUserInventoryContents(SID, 440, 2, false, (ERR, INV) => {
    if (!ERR) {
      inventory.stock.tfKeys.tradable = 0;
      inventory.stock.tfKeys.notradable = 0;
      for (let i = 0; i < INV.length; i += 1) {
        if (acceptedKeys.tf.indexOf(INV[i].market_hash_name) >= 0) {
          if (INV[i].tradable) {
            inventory.stock.tfKeys.tradable += 1;
          } else {
            inventory.stock.tfKeys.notradable += 1;
          }
        }
      }
      log.warn(
        `Bot's TF2 loaded: ${inventory.stock.tfKeys.tradable} tradable, ${inventory.stock.tfKeys.notradable} notradable.`
      );
      callback();
    } else {
      log.error(`An error occurred while getting bot TF2 inventory: ${ERR}`);
      callback(ERR);
    }
  });
};

inventory.loadGEMS = (SID, community, callback) => {
  community.getUserInventoryContents(SID, 753, 6, false, (ERR, INV) => {
    if (!ERR) {
      inventory.stock.gemsQuantity.tradable = 0;
      inventory.stock.gemsQuantity.notradable = 0;
      for (let i = 0; i < INV.length; i += 1) {
        if (acceptedKeys.steamGems.indexOf(INV[i].market_hash_name) >= 0) {
          if (INV[i].tradable) {
            inventory.stock.gemsQuantity.tradable += INV[i].amount;
          } else {
            inventory.stock.gemsQuantity.notradable += INV[i].amount;
          }
        }
      }
      log.warn(
        `Bot's Gems loaded: ${inventory.stock.gemsQuantity.tradable} tradable, ${inventory.stock.gemsQuantity.notradable} notradable.`
      );
      callback();
    } else {
      log.error(`An error occurred while getting bot Gems inventory: ${ERR}`);
      callback(ERR);
    }
  });
};

inventory.loadSETS = (SID, community, allCards, callback) => {
  inventory.getInventory(SID, community, (ERR1, DATA1) => {
    if (!ERR1) {
      const s = DATA1;
      getSets(s, allCards, (ERR2, DATA2) => {
        if (!ERR2) {
          inventory.botSets = DATA2;
          let botNSets = 0;
          for (let i = 0; i < Object.keys(inventory.botSets).length; i += 1) {
            botNSets +=
              inventory.botSets[Object.keys(inventory.botSets)[i]].length;
          }
          inventory.stock.totalBotSets = botNSets;
          log.warn(`Bot's Sets loaded: ${inventory.stock.totalBotSets}`);
          callback();
        } else {
          log.error(`An error occurred while getting bot sets: ${ERR2}`);
          callback(ERR2);
        }
      });
    } else {
      log.error(`An error occurred while getting bot inventory: ${ERR1}`);
      callback(ERR1);
    }
  });
};

module.exports = inventory;
