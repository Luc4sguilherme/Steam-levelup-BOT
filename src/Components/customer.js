/* eslint-disable no-shadow */
/* eslint-disable consistent-return */

const async = require('async');
const moment = require('moment');

const log = require('./log');
const acceptedKeys = require('../Config/keys');
const { getSets } = require('./sets');
const inventory = require('./inventory');
const utils = require('../Utils');

const customer = {};

customer.stock = {
  totalSets: 0,
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

customer.loadInventory = (id64, community, allCards, callback) => {
  const Inventory = {
    GEMS: (callback) => {
      customer.loadGEMS(id64, community, (ERR) => {
        if (ERR) {
          callback(ERR);
        } else {
          callback(null, true);
        }
      });
    },
    CSGO: (callback) => {
      customer.loadCSGO(id64, community, (ERR) => {
        if (ERR) {
          callback(ERR);
        } else {
          callback(null, true);
        }
      });
    },
    HYDRA: (callback) => {
      customer.loadHYDRA(id64, community, (ERR) => {
        if (ERR) {
          callback(ERR);
        } else {
          callback(null, true);
        }
      });
    },
    TF2: (callback) => {
      customer.loadTF(id64, community, (ERR) => {
        if (ERR) {
          callback(ERR);
        } else {
          callback(null, true);
        }
      });
    },
    SETS: (callback) => {
      setTimeout(() => {
        customer.loadSETS(id64, community, allCards, (ERR) => {
          if (ERR) {
            callback(ERR);
          } else {
            callback(null, true);
          }
        });
      }, moment.duration(3, 'seconds'));
    },
  };

  async.series(Inventory, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

customer.loadCSGO = (id64, community, callback) => {
  community.getUserInventoryContents(id64, 730, 2, false, (ERR, INV) => {
    if (!ERR) {
      customer.stock.csKeys.tradable = 0;
      customer.stock.csKeys.notradable = 0;
      for (let i = 0; i < INV.length; i += 1) {
        if (acceptedKeys.csgo.indexOf(INV[i].market_hash_name) >= 0) {
          if (INV[i].tradable) {
            customer.stock.csKeys.tradable += 1;
          } else {
            customer.stock.csKeys.notradable += 1;
          }
        }
      }

      callback();
    } else {
      log.error(`An error occurred while getting user CSGO inventory: ${ERR}`);
      callback(ERR);
    }
  });
};

customer.loadHYDRA = (id64, community, callback) => {
  community.getUserInventoryContents(id64, 730, 2, false, (ERR, INV) => {
    if (!ERR) {
      customer.stock.hydraKeys.tradable = 0;
      customer.stock.hydraKeys.notradable = 0;
      for (let i = 0; i < INV.length; i += 1) {
        if (acceptedKeys.hydra.indexOf(INV[i].market_hash_name) >= 0) {
          if (INV[i].tradable) {
            customer.stock.hydraKeys.tradable += 1;
          } else {
            customer.stock.hydraKeys.notradable += 1;
          }
        }
      }

      callback();
    } else {
      log.error(`An error occurred while getting user HYDRA inventory: ${ERR}`);
      callback(ERR);
    }
  });
};

customer.loadTF = (id64, community, callback) => {
  community.getUserInventoryContents(id64, 440, 2, false, (ERR, INV) => {
    if (!ERR) {
      customer.stock.tfKeys.tradable = 0;
      customer.stock.tfKeys.notradable = 0;
      for (let i = 0; i < INV.length; i += 1) {
        if (acceptedKeys.tf.indexOf(INV[i].market_hash_name) >= 0) {
          if (INV[i].tradable) {
            customer.stock.tfKeys.tradable += 1;
          } else {
            customer.stock.tfKeys.notradable += 1;
          }
        }
      }

      callback();
    } else {
      log.error(`An error occurred while getting user TF2 inventory: ${ERR}`);
      callback(ERR);
    }
  });
};

customer.loadGEMS = (id64, community, callback) => {
  community.getUserInventoryContents(id64, 753, 6, false, (ERR, INV) => {
    if (!ERR) {
      customer.stock.gemsQuantity.tradable = 0;
      customer.stock.gemsQuantity.notradable = 0;
      for (let i = 0; i < INV.length; i += 1) {
        if (acceptedKeys.steamGems.indexOf(INV[i].market_hash_name) >= 0) {
          if (INV[i].tradable) {
            customer.stock.gemsQuantity.tradable += INV[i].amount;
          } else {
            customer.stock.gemsQuantity.notradable += INV[i].amount;
          }
        }
      }

      callback();
    } else {
      log.error(`An error occurred while getting user Gems inventory: ${ERR}`);
      callback(ERR);
    }
  });
};

customer.loadSETS = (id64, community, allCards, callback) => {
  inventory.getInventory(id64, community, (ERR1, DATA) => {
    if (!ERR1) {
      const s = DATA;
      getSets(s, allCards, (ERR2, DDATA) => {
        if (!ERR2) {
          let userNSets = 0;
          for (let i = 0; i < Object.keys(DDATA).length; i += 1) {
            userNSets += DDATA[Object.keys(DDATA)[i]].length;
          }
          customer.stock.totalSets = userNSets;
          callback();
        } else {
          callback(ERR2);
        }
      });
    } else {
      log.error(`An error occurred while getting user Sets inventory: ${ERR1}`);
      callback(ERR1);
    }
  });
};

customer.badge = (id64, callback) => {
  if (Object.keys(inventory.botSets).length > 0) {
    utils.getBadges(id64, (ERR, DATA) => {
      if (!ERR) {
        const b = {};
        if (DATA) {
          for (let i = 0; i < Object.keys(DATA).length; i += 1) {
            if (DATA[Object.keys(DATA)[i]] < 6) {
              b[Object.keys(DATA)[i]] = 5 - DATA[Object.keys(DATA)[i]];
            }
          }
        }
        let hisMaxSets = 0;
        let botNSets = 0;

        for (let i = 0; i < Object.keys(b).length; i += 1) {
          if (
            inventory.botSets[Object.keys(b)[i]] &&
            inventory.botSets[Object.keys(b)[i]].length >= b[Object.keys(b)[i]]
          ) {
            hisMaxSets += b[Object.keys(b)[i]];
          }
        }

        for (let i = 0; i < Object.keys(inventory.botSets).length; i += 1) {
          if (Object.keys(b).indexOf(Object.keys(inventory.botSets)[i]) < 0) {
            if (
              inventory.botSets[Object.keys(inventory.botSets)[i]].length >= 5
            ) {
              hisMaxSets += 5;
            } else {
              hisMaxSets +=
                inventory.botSets[Object.keys(inventory.botSets)[i]].length;
            }
          }
          botNSets +=
            inventory.botSets[Object.keys(inventory.botSets)[i]].length;
        }

        callback(null, botNSets, hisMaxSets);
      } else {
        callback(ERR);
      }
    });
  }
};

module.exports = customer;
