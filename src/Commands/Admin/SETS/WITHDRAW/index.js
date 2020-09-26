/* eslint-disable no-restricted-syntax */
const messages = require('../../../../Config/messages');
const inventory = require('../../../../Components/inventory');
const utils = require('../../../../Utils/utils');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users, manager) => {
  if (inventory.botSets) {
    let n = msg.toUpperCase().replace('!WITHDRAWSETS ', '');
    const amountofsets = parseInt(n, 10);
    if (!Number.isNaN(n) && parseInt(n, 10) > 0) {
      log.adminChat(
        sender.getSteamID64(),
        users[sender.getSteamID64()].language,
        `[ !WITHDRAWSETS ${n} ]`
      );
      n = parseInt(n, 10);
      chatMessage(
        client,
        sender,
        messages.REQUEST[users[sender.getSteamID64()].language]
      );
      manager.getInventoryContents(753, 2, true, (ERR) => {
        if (ERR) {
          log.error(`An error occurred while getting inventory: ${ERR}`);
          chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.US[
              users[sender.getSteamID64()].language
            ]
          );
        } else {
          let amountofB = amountofsets;
          const mySets = [];
          utils.sortSetsByAmount(inventory.botSets, (DATA) => {
            const setsSent = {};
            firstLoop: for (let i = 0; i < DATA.length; i += 1) {
              if (inventory.botSets[DATA[i]]) {
                for (let j = 0; j < inventory.botSets[DATA[i]].length; j += 1) {
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
                users[sender.getSteamID64()].language
              ]
            );
          } else {
            const message = messages.TRADE.SETMESSAGE[0].SETS[
              users[sender.getSteamID64()].language
            ].replace('{SETS}', amountofsets);
            makeOffer(
              client,
              users,
              manager,
              sender.getSteamID64(),
              [].concat(...mySets),
              [],
              '!WITHDRAWSETS',
              message,
              amountofsets,
              0,
              0,
              0
            );
          }
        }
      });
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.INVALID.SETS[
          users[sender.getSteamID64()].language
        ].replace('{command}', '!WITHDRAWSETS 1')
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[2][
        users[sender.getSteamID64()].language
      ]
    );
  }
};
