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
  const amountofsets = parseInt(
    msg.toUpperCase().replace('!BUYANYGEMS ', ''),
    10
  );
  if (!Number.isNaN(amountofsets) && amountofsets > 0) {
    log.userChat(
      sender.getSteamID64(),
      utils.getLanguage(sender.getSteamID64(), users),
      `[ !BUYANYGEMS ${amountofsets} ]`
    );
    if (amountofsets <= main.maxBuy) {
      const theirGems = [];
      const mySets = [];
      let amountTheirGems = 0;
      chatMessage(
        client,
        sender,
        messages.REQUEST[utils.getLanguage(sender.getSteamID64(), users)]
      );
      manager.getUserInventoryContents(
        sender.getSteamID64(),
        753,
        6,
        true,
        (ERR, INV) => {
          if (!ERR) {
            let amountofB = amountofsets;
            let need = amountofsets * rates.gems.sell;
            const inv = INV;
            for (let i = 0; i < inv.length; i += 1) {
              if (need !== 0) {
                if (
                  acceptedCurrencies.steamGems.indexOf(
                    inv[i].market_hash_name
                  ) >= 0
                ) {
                  inv[i].amount = need <= inv[i].amount ? need : inv[i].amount;
                  need -= inv[i].amount;
                  amountTheirGems += inv[i].amount;
                  theirGems.push(inv[i]);
                }
              } else {
                break;
              }
            }
            if (amountTheirGems < amountofsets * rates.gems.sell) {
              chatMessage(
                client,
                sender,
                messages.ERROR.OUTOFSTOCK.DEFAULT.GEMS.THEM[0][
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
                const message = messages.TRADE.SETMESSAGE[1].GEMS[
                  utils.getLanguage(sender.getSteamID64(), users)
                ]
                  .replace('{SETS}', amountofsets)
                  .replace('{GEMS}', rates.gems.sell * amountofsets);
                makeOffer(
                  client,
                  users,
                  manager,
                  sender.getSteamID64(),
                  [].concat(...mySets),
                  theirGems,
                  '!BUYANYGEMS',
                  message,
                  amountofsets,
                  0,
                  0,
                  amountofsets * rates.gems.sell
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
        messages.ERROR.INPUT.AMOUNTOVER.SETS[
          utils.getLanguage(sender.getSteamID64(), users)
        ].replace('{SETS}', main.maxBuy)
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.SETS[
        utils.getLanguage(sender.getSteamID64(), users)
      ].replace('{command}', '!BUYANYGEMS 1')
    );
  }
};
