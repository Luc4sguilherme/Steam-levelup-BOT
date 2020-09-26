/* eslint-disable no-restricted-syntax */
/* eslint-disable no-labels */
/* eslint-disable no-continue */
const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');
const inventory = require('../../../../Utils/inventory');

module.exports = (sender, client, users, community, manager) => {
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !WITHDRAWLEFTOVER ]'
  );
  const cards = [];
  utils.chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  for (let i = 0; i < Object.keys(inventory.botSets).length; i += 1) {
    for (let j = 0; j < Object.values(inventory.botSets)[i].length; j += 1) {
      for (
        let k = 0;
        k < Object.keys(Object.values(inventory.botSets)[i][j]).length;
        k += 1
      ) {
        cards.push(
          Object.values(Object.values(inventory.botSets)[i])[j][k].assetid
        );
      }
    }
  }
  utils.getleftovercards(
    client.steamID.getSteamID64(),
    community,
    cards,
    (ERR, DATA) => {
      if (ERR) {
        utils.error(`An error occurred while getting inventory: ${ERR}`);
        utils.chatMessage(
          client,
          sender,
          messages.ERROR.LOADINVENTORY.US[users[sender.getSteamID64()].language]
        );
      } else {
        const Cards = {};
        const myCards = [];
        for (let j = 0; j < Object.keys(DATA).length; j += 1) {
          Cards[Object.keys(DATA)[j]] = Object.values(Object.values(DATA)[j]);
        }
        if (Object.keys(Cards).length === 0) {
          utils.chatMessage(
            client,
            sender,
            messages.ERROR.OUTOFSTOCK.DEFAULT.LEFTOVER[
              users[sender.getSteamID64()].language
            ]
          );
        } else {
          const cardsSent = {};
          utils.sortSetsByAmount(Cards, (DDATA) => {
            firstLoop: for (let i = 0; i < DDATA.length; i += 1) {
              if (Cards[DDATA[i]]) {
                for (let j = 0; j < Cards[DDATA[i]].length; j += 1) {
                  for (let k = 0; k < Cards[DDATA[i]][j].length; k += 1) {
                    if (
                      (cardsSent[DDATA[i]] && cardsSent[DDATA[i]] > -1) ||
                      !cardsSent[DDATA[i]]
                    ) {
                      myCards.push(Cards[DDATA[i]][j]);
                      if (!cardsSent[DDATA[i]]) {
                        cardsSent[DDATA[i]] = 1;
                      } else {
                        cardsSent[DDATA[i]] += 1;
                      }
                    } else {
                      continue firstLoop;
                    }
                  }
                }
              } else {
                continue;
              }
            }
          });
          let amountofleftovers = 0;
          for (const prop in cardsSent) {
            if (Object.prototype.hasOwnProperty.call(cardsSent, prop)) {
              amountofleftovers += cardsSent[prop];
            }
          }

          const message =
            messages.TRADE.SETMESSAGE[0].LEFTOVER[
              users[sender.getSteamID64()].language
            ];
          utils.makeOffer(
            client,
            users,
            manager,
            sender.getSteamID64(),
            [].concat(...myCards),
            [],
            '!WITHDRAWLEFTOVER',
            message,
            0,
            amountofleftovers,
            0,
            0
          );
        }
      }
    }
  );
};
