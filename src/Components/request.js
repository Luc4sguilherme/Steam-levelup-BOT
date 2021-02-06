/* eslint-disable no-restricted-syntax */
const main = require('../Config/main');
const utils = require('../Utils');
const log = require('./log');
const { getSets } = require('./sets');

module.exports = (ID64, community, allCards, manager, inventory, callback) => {
  if (ID64) {
    log.warn(`Auto Request to #${ID64}`);
    inventory.getInventory(ID64, community, (ERR1, DATA1) => {
      if (!ERR1) {
        const s = DATA1;
        getSets(s, allCards, (ERR2, DATA2) => {
          log.warn('SETS LOADED');
          if (!ERR2) {
            let userNSets = 0;
            for (let i = 0; i < Object.keys(DATA2).length; i += 1) {
              userNSets += DATA2[Object.keys(DATA2)[i]].length;
            }
            log.warn('Creating trade offer');
            const t = manager.createOffer(ID64);
            let amountofB = main.requester.amount
              ? main.requester.amount
              : userNSets;
            const setsSent = {};
            const cardsSent = {};
            const Cards = {};
            for (let j = 0; j < Object.keys(DATA1).length; j += 1) {
              Cards[Object.keys(DATA1)[j]] = Object.values(
                Object.values(DATA1)[j]
              );
            }
            utils.sortSetsByAmountB(s, (DATA3) => {
              firstLoop: for (let i = 0; i < DATA3.length; i += 1) {
                if (DATA2[DATA3[i]]) {
                  for (let j = 0; j < DATA2[DATA3[i]].length; j += 1) {
                    if (amountofB > 0) {
                      if (!setsSent[DATA3[i]]) {
                        setsSent[DATA3[i]] = 0;
                      }
                      if (
                        main.requester.ignoreLimit
                          ? true
                          : setsSent[DATA3[i]] +
                              (inventory.botSets[DATA3[i]]
                                ? inventory.botSets[DATA3[i]].length
                                : 0) <
                            main.maxStock
                      ) {
                        t.addTheirItems(DATA2[DATA3[i]][j]);
                        amountofB -= 1;
                        setsSent[DATA3[i]] += 1;
                      } else {
                        continue firstLoop;
                      }
                    } else {
                      continue firstLoop;
                    }
                  }
                } else if (main.requester.sendLeftOvers) {
                  if (Cards[DATA3[i]]) {
                    for (let j = 0; j < Cards[DATA3[i]].length; j += 1) {
                      for (let k = 0; k < Cards[DATA3[i]][j].length; k += 1) {
                        if (
                          (cardsSent[DATA3[i]] && cardsSent[DATA3[i]] > -1) ||
                          !cardsSent[DATA3[i]]
                        ) {
                          t.addTheirItems(Cards[DATA3[i]][j]);
                          if (!cardsSent[DATA3[i]]) {
                            cardsSent[DATA3[i]] = 1;
                          } else {
                            cardsSent[DATA3[i]] += 1;
                          }
                        } else {
                          continue firstLoop;
                        }
                      }
                    }
                  } else {
                    continue;
                  }
                } else {
                  continue;
                }
              }
            });
            let amountofSets = 0;
            let amountofleftovers = 0;
            for (const key in setsSent) {
              if (Object.prototype.hasOwnProperty.call(setsSent, key)) {
                amountofSets += setsSent[key];
              }
            }
            for (const key in cardsSent) {
              if (Object.prototype.hasOwnProperty.call(cardsSent, key)) {
                amountofleftovers += cardsSent[key];
              }
            }
            callback(true);
            if (
              (main.requester.sendLeftOvers && amountofleftovers > 0) ||
              amountofSets > 0
            ) {
              log.warn('Sending trade offer');
              t.data('commandused', 'AUTOREQUEST');
              t.data('amountofsets', amountofSets.toString());
              t.data('amountofleftovers', amountofleftovers.toString());
              t.data('amountofgems', 0);
              t.data('amountofkeys', 0);
              t.setMessage('Auto Request');
              t.send((ERR3) => {
                if (ERR3) {
                  log.error(
                    `An error occurred while sending trade offer: ${ERR3}`
                  );
                } else {
                  log.warn(`offer #${t.id} sent successfully`);
                }
              });
            } else {
              log.warn("Didn't find cards to requests.");
            }
          } else {
            log.error(`An error occurred while getting user sets: ${ERR2}`);
          }
        });
      } else {
        log.error(`An error occurred while getting user inventory: ${ERR1}`);
      }
    });
  } else {
    log.error('An error occurred while auto request: target is not defined');
  }
};
