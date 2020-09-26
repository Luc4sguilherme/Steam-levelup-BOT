/* eslint-disable no-continue */
const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');
const inventory = require('../../../../Utils/inventory');

module.exports = (sender, client, users, community, allCards, manager) => {
  utils.chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !RESTOCK ]'
  );
  inventory.getInventory(sender.getSteamID64(), community, (ERR1, DATA1) => {
    utils.warn('INVENTORY LOADED');
    if (!ERR1) {
      const s = DATA1;
      const theirSets = [];
      utils.getSets(s, allCards, (ERR2, DATA2) => {
        utils.warn('SETS LOADED');
        if (!ERR2) {
          let userNSets = 0;
          for (let i = 0; i < Object.keys(DATA2).length; i += 1) {
            userNSets += DATA2[Object.keys(DATA2)[i]].length;
          }
          if (userNSets === 0) {
            utils.chatMessage(
              client,
              sender,
              messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.THEM[1][
                users[sender.getSteamID64()].language
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
              users[sender.getSteamID64()].language
            ].replace('{SETS}', userNSets);
            utils.makeOffer(
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
          utils.chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.THEM[0][
              users[sender.getSteamID64()].language
            ]
          );
          utils.error(`An error occurred while getting user sets: ${ERR2}`);
        }
      });
    } else if (ERR1.message.indexOf('profile is private') > -1) {
      utils.chatMessage(
        client,
        sender,
        messages.ERROR.LOADINVENTORY.THEM[2][
          users[sender.getSteamID64()].language
        ]
      );
      utils.error(`An error occurred while getting user inventory: ${ERR1}`);
    } else {
      utils.chatMessage(
        client,
        sender,
        messages.ERROR.LOADINVENTORY.THEM[0][
          users[sender.getSteamID64()].language
        ]
      );
      utils.error(`An error occurred while getting user inventory: ${ERR1}`);
    }
  });
};
