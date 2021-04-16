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
  const n = parseInt(msg.toUpperCase().replace('!BUYHYDRA ', ''), 10);
  const amountofsets = n * rates.hydra.sell;
  const maxKeys = parseInt(main.maxBuy / rates.hydra.sell, 10);
  if (!Number.isNaN(n) && n > 0) {
    log.userChat(
      sender.getSteamID64(),
      utils.getLanguage(sender.getSteamID64(), users),
      `[ !BUYHYDRA ${n} ]`
    );
    if (n <= maxKeys) {
      const theirKeys = [];
      const mySets = [];
      chatMessage(
        client,
        sender,
        messages.REQUEST[utils.getLanguage(sender.getSteamID64(), users)]
      );
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
                acceptedCurrencies.hydra.indexOf(INV[i].market_hash_name) >= 0
              ) {
                theirKeys.push(INV[i]);
              }
            }
            if (theirKeys.length !== n) {
              chatMessage(
                client,
                sender,
                messages.ERROR.OUTOFSTOCK.DEFAULT.HYDRA.THEM[0][
                  utils.getLanguage(sender.getSteamID64(), users)
                ]
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
                      inventory.botSets[Object.keys(badges)[i]].length >=
                        badges[Object.keys(badges)[i]]
                    ) {
                      hisMaxSets += badges[Object.keys(badges)[i]];
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
                            for (let j = 0; j < 5 - badges[DDATA[i]]; j += 1) {
                              if (j + 1 < badges[DDATA[i]] && hisMaxSets > 0) {
                                mySets.push(inventory.botSets[DDATA[i]][j]);
                                hisMaxSets -= 1;
                              } else {
                                continue firstLoop;
                              }
                            }
                          } else if (
                            badges[DDATA[i]] &&
                            inventory.botSets[DDATA[i]].length <
                              badges[DDATA[i]]
                          ) {
                            // BOT DOESNT HAVE ENOUGH SETS OF THIS KIND
                            continue; // *
                          } else if (
                            !badges[DDATA[i]] &&
                            inventory.botSets[DDATA[i]].length < 5 &&
                            inventory.botSets[DDATA[i]].length -
                              badges[DDATA[i]] >
                              0
                          ) {
                            // TODO NOT FOR LOOP WITH BOTSETS. IT SENDS ALL
                            // BOT HAS ENOUGH SETS AND USER NEVER CRAFTED THIS
                            for (
                              let j = 0;
                              j <
                              inventory.botSets[DDATA[i]].length -
                                badges[DDATA[i]];
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
                          } else if (hisMaxSets < 5) {
                            // BOT DOESNT HAVE CARDS USER ALREADY CRAFTED, IF USER STILL NEEDS 5 SETS:
                            for (let j = 0; j !== hisMaxSets; j += 1) {
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
                          } else {
                            // BOT DOESNT HAVE CARDS USER ALREADY CRAFTED, IF USER STILL NEEDS LESS THAN 5 SETS:
                            for (let j = 0; j !== 5; j += 1 && hisMaxSets > 0) {
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
                          messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[0][
                            utils.getLanguage(sender.getSteamID64(), users)
                          ]
                        );
                      } else {
                        const message = messages.TRADE.SETMESSAGE[1].HYDRA[
                          utils.getLanguage(sender.getSteamID64(), users)
                        ]
                          .replace('{SETS}', amountofsets)
                          .replace('{HYDRA}', n);
                        makeOffer(
                          client,
                          users,
                          manager,
                          sender.getSteamID64(),
                          [].concat(...mySets),
                          theirKeys,
                          '!BUYHYDRA',
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
                      messages.ERROR.OUTOFSTOCK.NOTUSED.HYDRA[
                        utils.getLanguage(sender.getSteamID64(), users)
                      ].replace('{command}', `!BUYANYHYDRA ${n}`)
                    );
                  }
                } else {
                  chatMessage(
                    client,
                    sender,
                    messages.ERROR.BADGES[1][
                      utils.getLanguage(sender.getSteamID64(), users)
                    ]
                  );
                  log.error(`An error occurred while loading badges: ${ERR2}`);
                }
              });
            }
          } else if (ERR1.message.indexOf('profile is private') > -1) {
            chatMessage(
              client,
              sender,
              messages.ERROR.LOADINVENTORY.THEM[2][
                utils.getLanguage(sender.getSteamID64(), users)
              ]
            );
            log.error(
              `An error occurred while getting user inventory: ${ERR1}`
            );
          } else {
            chatMessage(
              client,
              sender,
              messages.ERROR.LOADINVENTORY.THEM[0][
                utils.getLanguage(sender.getSteamID64(), users)
              ]
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
        messages.ERROR.INPUT.AMOUNTOVER.HYDRA[
          utils.getLanguage(sender.getSteamID64(), users)
        ].replace('{KEYS}', maxKeys)
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.HYDRA[
        utils.getLanguage(sender.getSteamID64(), users)
      ].replace('{command}', '!BUYHYDRA 1')
    );
  }
};
