/* eslint-disable no-restricted-syntax */
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils');
const acceptedCurrencies = require('../../../../Config/currencies');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users, manager) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  const n = parseInt(msg.toUpperCase().replace('!BUYCSGO ', ''), 10);
  const amountofsets = n * rates.csgo.sell;
  const maxKeys = parseInt(main.maxBuy / rates.csgo.sell, 10);

  if (!Number.isNaN(n) && n > 0) {
    log.userChat(sender.getSteamID64(), language, `[ !BUYCSGO ${n} ]`);
    if (n <= maxKeys) {
      const theirKeys = [];
      const mySets = [];
      chatMessage(client, sender, messages.REQUEST[language]);
      manager.getUserInventoryContents(
        sender.getSteamID64(),
        730,
        2,
        true,
        (ERR1, INV) => {
          if (!ERR1) {
            for (let i = 0; i < INV.length; i += 1) {
              if (
                theirKeys.length < n &&
                acceptedCurrencies.csgo.indexOf(INV[i].market_hash_name) >= 0
              ) {
                theirKeys.push(INV[i]);
              }
            }
            if (theirKeys.length !== n) {
              chatMessage(
                client,
                sender,
                messages.ERROR.OUTOFSTOCK.DEFAULT.CSGO.THEM[0][language]
              );
            } else {
              utils.getBadges(sender.getSteamID64(), (ERR2, DATA) => {
                if (!ERR2) {
                  log.warn('Badge loaded without error');

                  const badges = {}; // List with badges that CAN still be crafted
                  let hisMaxSets = 0;

                  for (let i = 0; i < Object.keys(DATA).length; i += 1) {
                    if (DATA[Object.keys(DATA)[i]] < 6) {
                      badges[Object.keys(DATA)[i]] =
                        5 - DATA[Object.keys(DATA)[i]];
                    }
                  }

                  // Loop for sets he has partially completed
                  for (let i = 0; i < Object.keys(badges).length; i += 1) {
                    if (
                      inventory.botSets[Object.keys(badges)[i]] &&
                      Object.values(badges)[i] > 0
                    ) {
                      hisMaxSets += Math.min(
                        5,
                        inventory.botSets[Object.keys(badges)[i]].length,
                        Object.values(badges)[i]
                      );
                    }
                  }
                  // Loop for sets he has never crafted
                  for (
                    let i = 0;
                    i < Object.keys(inventory.botSets).length;
                    i += 1
                  ) {
                    if (
                      Object.keys(badges).indexOf(
                        Object.keys(inventory.botSets)[i]
                      ) < 0
                    ) {
                      if (
                        inventory.botSets[Object.keys(inventory.botSets)[i]]
                          .length >= 5
                      ) {
                        hisMaxSets += 5;
                      } else {
                        hisMaxSets +=
                          inventory.botSets[Object.keys(inventory.botSets)[i]]
                            .length;
                      }
                    }
                  }
                  // HERE
                  if (amountofsets <= hisMaxSets) {
                    hisMaxSets = amountofsets;
                    utils.sortSetsByAmount(inventory.botSets, (DDATA) => {
                      firstLoop: for (let i = 0; i < DDATA.length; i += 1) {
                        if (badges[DDATA[i]] === 0) {
                          continue;
                        } else if (hisMaxSets > 0) {
                          if (
                            badges[DDATA[i]] &&
                            inventory.botSets[DDATA[i]].length >=
                              badges[DDATA[i]]
                          ) {
                            for (let j = 0; j < badges[DDATA[i]]; j += 1) {
                              if (hisMaxSets > 0) {
                                mySets.push(inventory.botSets[DDATA[i]][j]);
                                hisMaxSets -= 1;
                              }
                            }
                          } else if (
                            badges[DDATA[i]] &&
                            inventory.botSets[DDATA[i]].length <
                              badges[DDATA[i]]
                          ) {
                            for (
                              let j = 0;
                              j < inventory.botSets[DDATA[i]].length;
                              j += 1
                            ) {
                              if (hisMaxSets > 0) {
                                mySets.push(inventory.botSets[DDATA[i]][j]);
                                hisMaxSets -= 1;
                              }
                            }
                          } else if (!badges[DDATA[i]]) {
                            for (
                              let j = 0;
                              j <
                              Math.min(5, inventory.botSets[DDATA[i]].length);
                              j += 1
                            ) {
                              if (
                                inventory.botSets[DDATA[i]][j] &&
                                hisMaxSets > 0
                              ) {
                                mySets.push(inventory.botSets[DDATA[i]][j]);
                                hisMaxSets -= 1;
                              } else {
                                continue firstLoop;
                              }
                            }
                          }
                        } else {
                          break;
                        }
                      }
                      if (hisMaxSets > 0) {
                        chatMessage(
                          client,
                          sender,
                          messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[0][language]
                        );
                      } else {
                        const message = messages.TRADE.SETMESSAGE[1].CSGO[
                          language
                        ]
                          .replace('{SETS}', amountofsets)
                          .replace('{CSGO}', n);
                        makeOffer(
                          client,
                          users,
                          manager,
                          sender.getSteamID64(),
                          [].concat(...mySets),
                          theirKeys,
                          '!BUYCSGO',
                          message,
                          amountofsets,
                          0,
                          n,
                          0
                        );
                      }
                    });
                  } else {
                    chatMessage(
                      client,
                      sender,
                      messages.ERROR.OUTOFSTOCK.NOTUSED.CSGO[language].replace(
                        '{command}',
                        `!BUYANYCSGO ${n}`
                      )
                    );
                  }
                } else {
                  chatMessage(
                    client,
                    sender,
                    messages.ERROR.BADGES[1][language]
                  );
                  log.error(`An error occurred while loading badges: ${ERR2}`);
                }
              });
            }
          } else if (ERR1.message.indexOf('profile is private') > -1) {
            chatMessage(
              client,
              sender,
              messages.ERROR.LOADINVENTORY.THEM[2][language]
            );
            log.error(
              `An error occurred while getting user inventory: ${ERR1}`
            );
          } else {
            chatMessage(
              client,
              sender,
              messages.ERROR.LOADINVENTORY.THEM[0][language]
            );
            log.error(
              `An error occurred while getting user inventory: ${ERR1}`
            );
          }
        }
      );
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.AMOUNTOVER.CSGO[language].replace(
          '{KEYS}',
          maxKeys
        )
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.CSGO[language].replace(
        '{command}',
        '!BUYCSGO 1'
      )
    );
  }
};
