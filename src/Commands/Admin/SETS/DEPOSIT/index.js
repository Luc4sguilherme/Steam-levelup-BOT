/* eslint-disable no-restricted-syntax */
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const inventory = require('../../../../Components/inventory');
const utils = require('../../../../Utils');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const { getSets } = require('../../../../Components/sets');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users, community, allCards, manager) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  const dataInput = msg.toUpperCase().replace('!DEPOSITSETS ', '');
  let amountofsets;
  let ignoreMaxStock = 0;
  if (dataInput.search(',') !== -1) {
    amountofsets = parseInt(dataInput.substring(0, dataInput.indexOf(',')), 10);
    ignoreMaxStock = parseInt(
      dataInput.substring(dataInput.indexOf(',') + 1),
      10
    );
  } else {
    amountofsets = parseInt(dataInput, 10);
  }

  if (!Number.isNaN(amountofsets) && parseInt(amountofsets, 10) > 0) {
    log.adminChat(
      sender.getSteamID64(),
      language,
      `[ !DEPOSITSETS ${amountofsets} ]`
    );
    chatMessage(client, sender, messages.REQUEST[language]);
    let amountofB = amountofsets;
    inventory.getInventory(sender.getSteamID64(), community, (ERR1, DATA1) => {
      if (!ERR1) {
        const s = DATA1;
        const theirSets = [];
        getSets(s, allCards, (ERR2, DDATA) => {
          if (!ERR2) {
            utils.sortSetsByAmount(s, (DATA2) => {
              const setsSent = {};
              firsttLoop: for (let i = 0; i < DATA2.length; i += 1) {
                if (DDATA[DATA2[i]]) {
                  for (let j = 0; j < DDATA[DATA2[i]].length; j += 1) {
                    if (amountofB > 0) {
                      if (!setsSent[DATA2[i]]) {
                        setsSent[DATA2[i]] = 0;
                      }
                      if (
                        ignoreMaxStock ||
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
              chatMessage(
                client,
                sender,
                messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.THEM[0][language]
              );
            } else {
              const message = messages.TRADE.SETMESSAGE[0].SETS[
                language
              ].replace('{SETS}', amountofsets);
              makeOffer(
                client,
                users,
                manager,
                sender.getSteamID64(),
                [],
                [].concat(...theirSets),
                '!DEPOSITSETS',
                message,
                amountofsets,
                0,
                0,
                0
              );
            }
          } else {
            chatMessage(
              client,
              sender,
              messages.ERROR.LOADINVENTORY.THEM[0][language]
            );
            log.error(`An error occurred while getting user sets: ${ERR2}`);
          }
        });
      } else if (ERR1.message.indexOf('profile is private') > -1) {
        chatMessage(
          client,
          sender,
          messages.ERROR.LOADINVENTORY.THEM[2][language]
        );
        log.error(`An error occurred while getting user inventory: ${ERR1}`);
      } else {
        chatMessage(
          client,
          sender,
          messages.ERROR.LOADINVENTORY.THEM[0][language]
        );
        log.error(`An error occurred while getting user inventory: ${ERR1}`);
      }
    });
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.SETS[language].replace(
        '{command}',
        '!DEPOSITSETS 1'
      )
    );
  }
};
