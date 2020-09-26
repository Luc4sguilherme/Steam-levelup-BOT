/* eslint-disable no-restricted-syntax */
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils/utils');
const acceptedKeys = require('../../../../Config/keys');
const inventory = require('../../../../Utils/inventory');

module.exports = (sender, msg, client, users, community, allCards, manager) => {
  if (inventory.botSets) {
    const n = parseInt(msg.toUpperCase().replace('!SELLGEMS ', ''), 10);
    const amountofsets = n;
    if (!Number.isNaN(n) && parseInt(n, 10) > 0) {
      utils.userChat(
        sender.getSteamID64(),
        users[sender.getSteamID64()].language,
        `[ !SELLGEMS ${n} ]`
      );
      if (n <= main.maxSell) {
        utils.chatMessage(
          client,
          sender,
          messages.REQUEST[users[sender.getSteamID64()].language]
        );
        let gemsAmount = 0;
        const botGems = [];
        const theirSets = [];
        manager.getInventoryContents(753, 6, true, (ERR1, INV) => {
          if (ERR1) {
            utils.error(
              `An error occurred while getting bot inventory: ${ERR1}`
            );
            utils.chatMessage(
              client,
              sender,
              messages.ERROR.LOADINVENTORY.US[
                users[sender.getSteamID64()].language
              ]
            );
          } else {
            let need = n * rates.gems.buy;
            const inv = INV;
            for (let i = 0; i < inv.length; i += 1) {
              if (need !== 0) {
                if (
                  acceptedKeys.steamGems.indexOf(inv[i].market_hash_name) >= 0
                ) {
                  inv[i].amount = need <= inv[i].amount ? need : inv[i].amount;
                  need -= inv[i].amount;
                  gemsAmount += inv[i].amount;
                  botGems.push(inv[i]);
                }
              } else {
                break;
              }
            }
            if (gemsAmount < n * rates.gems.buy) {
              utils.chatMessage(
                client,
                sender,
                messages.ERROR.OUTOFSTOCK.DEFAULT.GEMS.US[0][
                  users[sender.getSteamID64()].language
                ]
              );
            } else {
              let amountofB = amountofsets;
              inventory.getInventory(
                sender.getSteamID64(),
                community,
                (ERR2, DATA) => {
                  if (!ERR2) {
                    const s = DATA;
                    utils.getSets(s, allCards, (ERR3, DDATA) => {
                      if (!ERR3) {
                        utils.sortSetsByAmountB(s, (DATA2) => {
                          const setsSent = {};
                          firsttLoop: for (
                            let i = 0;
                            i < DATA2.length;
                            i += 1
                          ) {
                            if (DDATA[DATA2[i]]) {
                              for (
                                let j = 0;
                                j < DDATA[DATA2[i]].length;
                                j += 1
                              ) {
                                if (amountofB > 0) {
                                  if (!setsSent[DATA2[i]]) {
                                    setsSent[DATA2[i]] = 0;
                                  }
                                  if (
                                    setsSent[DATA2[i]] +
                                      (inventory.botSets[DATA2[i]]
                                        ? inventory.botSets[DATA2[i]].length
                                        : 0) <
                                    main.maxStock
                                  ) {
                                    theirSets.push(DDATA[DATA2[i]][j]);
                                    amountofB -= 1;
                                    setsSent[DATA2[i]] += 1;
                                  } else {
                                    continue firsttLoop;
                                  }
                                } else {
                                  continue firsttLoop;
                                }
                              }
                            } else {
                              continue;
                            }
                          }
                        });
                        if (amountofB > 0) {
                          utils.chatMessage(
                            client,
                            sender,
                            messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.THEM[0][
                              users[sender.getSteamID64()].language
                            ]
                          );
                        } else {
                          const message = messages.TRADE.SETMESSAGE[2].GEMS[
                            users[sender.getSteamID64()].language
                          ]
                            .replace('{SETS}', amountofsets)
                            .replace('{GEMS}', rates.gems.buy * n);
                          utils.makeOffer(
                            client,
                            users,
                            manager,
                            sender.getSteamID64(),
                            botGems,
                            [].concat(...theirSets),
                            '!SELLGEMS',
                            message,
                            amountofsets,
                            0,
                            0,
                            n * rates.gems.sell
                          );
                        }
                      } else {
                        utils.chatMessage(
                          client,
                          sender,
                          messages.ERROR.LOADINVENTORY.THEM[0][
                            users[sender.getSteamID64()].language
                          ]
                        );
                        utils.error(
                          `An error occurred while getting user sets: ${ERR3}`
                        );
                      }
                    });
                  } else if (ERR2.message.indexOf('profile is private') > -1) {
                    utils.chatMessage(
                      client,
                      sender,
                      messages.ERROR.LOADINVENTORY.THEM[2][
                        users[sender.getSteamID64()].language
                      ]
                    );
                    utils.error(
                      `An error occurred while getting user inventory: ${ERR2}`
                    );
                  } else {
                    utils.chatMessage(
                      client,
                      sender,
                      messages.ERROR.LOADINVENTORY.THEM[0][
                        users[sender.getSteamID64()].language
                      ]
                    );
                    utils.error(
                      `An error occurred while getting user inventory: ${ERR2}`
                    );
                  }
                }
              );
            }
          }
        });
      } else {
        utils.chatMessage(
          client,
          sender,
          messages.ERROR.INPUT.AMOUNTOVER.SETS[
            users[sender.getSteamID64()].language
          ]
        );
      }
    } else {
      utils.chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.INVALID.SETS[
          users[sender.getSteamID64()].language
        ].replace('{command}', '!SELLGEMS 1')
      );
    }
  } else {
    utils.chatMessage(
      client,
      sender,
      messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[2][
        users[sender.getSteamID64()].language
      ]
    );
  }
};
