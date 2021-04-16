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
  const n = parseInt(msg.toUpperCase().replace('!BUYANYHYDRA ', ''), 10);
  const amountofsets = n * rates.hydra.sell;
  const maxKeys = parseInt(main.maxBuy / rates.hydra.sell, 10);
  if (!Number.isNaN(n) && n > 0) {
    log.userChat(
      sender.getSteamID64(),
      utils.getLanguage(sender.getSteamID64(), users),
      `[ !BUYANYHYDRA ${n} ]`
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
        (ERR, INV) => {
          if (!ERR) {
            let amountofB = amountofsets;
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
              utils.sortSetsByAmount(inventory.botSets, (DATA) => {
                const setsSent = {};
                firstLoop: for (let i = 0; i < DATA.length; i += 1) {
                  if (inventory.botSets[DATA[i]]) {
                    for (
                      let j = 0;
                      j < inventory.botSets[DATA[i]].length;
                      j += 1
                    ) {
                      if (amountofB > 0) {
                        if (
                          (setsSent[DATA[i]] && setsSent[DATA[i]] > -1) ||
                          !setsSent[DATA[i]]
                        ) {
                          mySets.push(inventory.botSets[DATA[i]][j]);
                          amountofB -= 1;
                          if (!setsSent[DATA[i]]) {
                            setsSent[DATA[i]] = 1;
                          } else {
                            setsSent[DATA[i]] += 1;
                          }
                        } else {
                          continue firstLoop;
                        }
                      } else {
                        continue firstLoop;
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
                  '!BUYANYHYDRA',
                  message,
                  amountofsets,
                  0,
                  n,
                  0
                );
              }
            }
          } else if (ERR.message.indexOf('profile is private') > -1) {
            chatMessage(
              client,
              sender,
              messages.ERROR.LOADINVENTORY.THEM[2][
                utils.getLanguage(sender.getSteamID64(), users)
              ]
            );
            log.error(`An error occurred while getting user inventory: ${ERR}`);
          } else {
            chatMessage(
              client,
              sender,
              messages.ERROR.LOADINVENTORY.THEM[0][
                utils.getLanguage(sender.getSteamID64(), users)
              ]
            );
            log.error(`An error occurred while getting user inventory: ${ERR}`);
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
      ].replace('{command}', '!BUYANYHYDRA 1')
    );
  }
};
