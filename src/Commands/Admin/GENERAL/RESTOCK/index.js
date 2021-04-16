/* eslint-disable no-continue */
const utils = require('../../../../Utils');
const messages = require('../../../../Config/messages');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const { getSets } = require('../../../../Components/sets');
const log = require('../../../../Components/log');

module.exports = (sender, client, users, community, allCards, manager) => {
  chatMessage(
    client,
    sender,
    messages.REQUEST[utils.getLanguage(sender.getSteamID64(), users)]
  );
  log.adminChat(
    sender.getSteamID64(),
    utils.getLanguage(sender.getSteamID64(), users),
    '[ !RESTOCK ]'
  );
  inventory.getInventory(sender.getSteamID64(), community, (ERR1, DATA1) => {
    log.warn('INVENTORY LOADED');
    if (!ERR1) {
      const s = DATA1;
      const theirSets = [];
      getSets(s, allCards, (ERR2, DATA2) => {
        log.warn('SETS LOADED');
        if (!ERR2) {
          let userNSets = 0;
          for (let i = 0; i < Object.keys(DATA2).length; i += 1) {
            userNSets += DATA2[Object.keys(DATA2)[i]].length;
          }
          if (userNSets === 0) {
            chatMessage(
              client,
              sender,
              messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.THEM[1][
                utils.getLanguage(sender.getSteamID64(), users)
              ]
            );
          } else {
            utils.sortSetsByAmountB(s, (DATA3) => {
              for (let i = 0; i < DATA3.length; i += 1) {
                if (DATA2[DATA3[i]]) {
                  for (let j = 0; j < DATA2[DATA3[i]].length; j += 1) {
                    theirSets.push(DATA2[DATA3[i]][j]);
                  }
                } else {
                  continue;
                }
              }
            });
            const message = messages.TRADE.SETMESSAGE[0].SETS[
              utils.getLanguage(sender.getSteamID64(), users)
            ].replace('{SETS}', userNSets);
            makeOffer(
              client,
              users,
              manager,
              sender.getSteamID64(),
              [],
              [].concat(...theirSets),
              '!RESTOCK',
              message,
              userNSets,
              0,
              0,
              0
            );
          }
        } else {
          chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.THEM[0][
              utils.getLanguage(sender.getSteamID64(), users)
            ]
          );
          log.error(`An error occurred while getting user sets: ${ERR2}`);
        }
      });
    } else if (ERR1.message.indexOf('profile is private') > -1) {
      chatMessage(
        client,
        sender,
        messages.ERROR.LOADINVENTORY.THEM[2][
          utils.getLanguage(sender.getSteamID64(), users)
        ]
      );
      log.error(`An error occurred while getting user inventory: ${ERR1}`);
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.LOADINVENTORY.THEM[0][
          utils.getLanguage(sender.getSteamID64(), users)
        ]
      );
      log.error(`An error occurred while getting user inventory: ${ERR1}`);
    }
  });
};
