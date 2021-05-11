/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-labels */
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const { getSets } = require('../../../../Components/sets');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users, community, allCards, manager) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);

  if (Object.keys(inventory.botSets).length) {
    const input = msg.toUpperCase();
    const command = input.match('!SETS4SETS') || input.match('!SET4SET') || [];
    const amountofsets = parseInt(input.replace(`${command[0]} `, ''), 10);

    if (!Number.isNaN(amountofsets) && amountofsets > 0) {
      log.userChat(
        sender.getSteamID64(),
        language,
        `[ !SETS4SETS ${amountofsets} ]`
      );
      if (amountofsets <= main.maxSets4Sets) {
        const mySets = [];
        const theirSets = [];
        chatMessage(client, sender, messages.REQUEST[language]);
        let amountofB = amountofsets;
        inventory.getInventory(
          sender.getSteamID64(),
          community,
          (ERR1, DATA1) => {
            if (!ERR1) {
              const s = DATA1;
              const requestedSets = {};
              getSets(s, allCards, (ERR2, DATA2) => {
                if (!ERR2) {
                  utils.sortSetsByAmountB(s, (DATA3) => {
                    firsttLoop: for (let i = 0; i < DATA3.length; i += 1) {
                      if (DATA2[DATA3[i]]) {
                        for (let j = 0; j < DATA2[DATA3[i]].length; j += 1) {
                          if (amountofB > 0) {
                            if (!requestedSets[DATA3[i]]) {
                              requestedSets[DATA3[i]] = 0;
                            }
                            if (
                              requestedSets[DATA3[i]] +
                                (inventory.botSets[DATA3[i]]
                                  ? inventory.botSets[DATA3[i]].length
                                  : 0) <
                              main.maxStock
                            ) {
                              theirSets.push(DATA2[DATA3[i]][j]);
                              amountofB -= 1;
                              requestedSets[DATA3[i]] += 1;
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
                    chatMessage(
                      client,
                      sender,
                      messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.THEM[0][language]
                    );
                  } else {
                    utils.getBadges(sender.getSteamID64(), (ERR3, DATA4) => {
                      if (!ERR3) {
                        log.warn('Badge loaded without error');

                        const badges = {}; // List with badges that CAN still be crafted
                        let hisMaxSets = 0;

                        for (let i = 0; i < Object.keys(DATA4).length; i += 1) {
                          if (DATA4[Object.keys(DATA4)[i]] < 6) {
                            badges[Object.keys(DATA4)[i]] =
                              5 - DATA4[Object.keys(DATA4)[i]];
                          }
                        }

                        // Loop for sets he has partially completed
                        for (
                          let i = 0;
                          i < Object.keys(badges).length;
                          i += 1
                        ) {
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
                              inventory.botSets[
                                Object.keys(inventory.botSets)[i]
                              ].length >= 5
                            ) {
                              hisMaxSets += 5;
                            } else {
                              hisMaxSets +=
                                inventory.botSets[
                                  Object.keys(inventory.botSets)[i]
                                ].length;
                            }
                          }
                        }
                        // HERE
                        if (amountofsets <= hisMaxSets) {
                          hisMaxSets = amountofsets;
                          utils.sortSetsByAmount(inventory.botSets, (DATA5) => {
                            let DATA6 = DATA5;
                            for (let i = 0; i < DATA6.length; i += 1) {
                              if (requestedSets[DATA6[i]]) {
                                delete DATA6[i];
                              }
                            }

                            DATA6 = DATA6.filter(() => true);
                            firstLoop: for (
                              let i = 0;
                              i < DATA6.length;
                              i += 1
                            ) {
                              if (badges[DATA6[i]] === 0) {
                                continue;
                              } else if (hisMaxSets > 0) {
                                if (
                                  badges[DATA6[i]] &&
                                  inventory.botSets[DATA6[i]].length >=
                                    badges[DATA6[i]]
                                ) {
                                  for (
                                    let j = 0;
                                    j < 5 - badges[DATA6[i]];
                                    j += 1
                                  ) {
                                    if (
                                      j + 1 < badges[DATA6[i]] &&
                                      hisMaxSets > 0
                                    ) {
                                      mySets.push(
                                        inventory.botSets[DATA6[i]][j]
                                      );
                                      hisMaxSets -= 1;
                                    } else {
                                      continue firstLoop;
                                    }
                                  }
                                } else if (
                                  badges[DATA6[i]] &&
                                  inventory.botSets[DATA6[i]].length <
                                    badges[DATA6[i]]
                                ) {
                                  // BOT DOESNT HAVE ENOUGH SETS OF THIS KIND
                                  continue; // *
                                } else if (
                                  !badges[DATA6[i]] &&
                                  inventory.botSets[DATA6[i]].length < 5 &&
                                  inventory.botSets[DATA6[i]].length -
                                    badges[DATA6[i]] >
                                    0
                                ) {
                                  // TODO NOT FOR LOOP WITH BOTSETS. IT SENDS ALL
                                  // BOT HAS ENOUGH SETS AND USER NEVER CRAFTED THIS
                                  for (
                                    let j = 0;
                                    j <
                                    inventory.botSets[DATA6[i]].length -
                                      badges[DATA6[i]];
                                    j += 1
                                  ) {
                                    if (
                                      inventory.botSets[DATA6[i]][j] &&
                                      hisMaxSets > 0
                                    ) {
                                      mySets.push(
                                        inventory.botSets[DATA6[i]][j]
                                      );
                                      hisMaxSets -= 1;
                                    } else {
                                      continue firstLoop;
                                    }
                                  }
                                } else if (hisMaxSets < 5) {
                                  // BOT DOESNT HAVE CARDS USER ALREADY CRAFTED, IF USER STILL NEEDS 5 SETS:
                                  for (let j = 0; j !== hisMaxSets; j += 1) {
                                    if (
                                      inventory.botSets[DATA6[i]][j] &&
                                      hisMaxSets > 0
                                    ) {
                                      mySets.push(
                                        inventory.botSets[DATA6[i]][j]
                                      );
                                      hisMaxSets -= 1;
                                    } else {
                                      continue firstLoop;
                                    }
                                  }
                                } else {
                                  // BOT DOESNT HAVE CARDS USER ALREADY CRAFTED, IF USER STILL NEEDS LESS THAN 5 SETS:
                                  for (
                                    let j = 0;
                                    j !== 5;
                                    j += 1 && hisMaxSets > 0
                                  ) {
                                    if (
                                      inventory.botSets[DATA6[i]][j] &&
                                      hisMaxSets > 0
                                    ) {
                                      mySets.push(
                                        inventory.botSets[DATA6[i]][j]
                                      );
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
                                  language
                                ]
                              );
                            } else {
                              const message = messages.TRADE.SETMESSAGE[3].SETS[
                                language
                              ]
                                .replace('{SETS1}', mySets.length)
                                .replace('{SETS2}', theirSets.length);
                              makeOffer(
                                client,
                                users,
                                manager,
                                sender.getSteamID64(),
                                [].concat(...mySets),
                                [].concat(...theirSets),
                                '!SETS4SETS',
                                message,
                                amountofsets,
                                0,
                                0,
                                0
                              );
                            }
                          });
                        } else {
                          chatMessage(
                            client,
                            sender,
                            messages.ERROR.OUTOFSTOCK.NOTUSED.SETS[language]
                          );
                        }
                      } else {
                        chatMessage(
                          client,
                          sender,
                          messages.ERROR.BADGES[1][language]
                        );
                        log.error(
                          `An error occurred while loading badges: ${ERR3}`
                        );
                      }
                    });
                  }
                } else {
                  chatMessage(
                    client,
                    sender,
                    messages.ERROR.LOADINVENTORY.THEM[0][language]
                  );
                  log.error(
                    `An error occurred while getting user sets: ${ERR2}`
                  );
                }
              });
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
          messages.SETS4SETS.AMOUNTOVER[language].replace(
            '{SETS}',
            main.maxSets4Sets
          )
        );
      }
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.INVALID.SETS[language].replace(
          '{command}',
          `${command} 1`
        )
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[2][language]
    );
  }
};
