const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');
const acceptedKeys = require('../../../../Config/keys');

module.exports = (sender, msg, client, users, manager) => {
  const amountgems = parseInt(
    msg.toUpperCase().replace('!DEPOSITGEMS ', ''),
    10
  );
  if (!Number.isNaN(amountgems) && parseInt(amountgems, 10) > 0) {
    utils.adminChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !DEPOSITGEMS ${amountgems} ]`
    );
    utils.chatMessage(
      client,
      sender,
      messages.REQUEST[users[sender.getSteamID64()].language]
    );
    manager.getUserInventoryContents(
      sender.getSteamID64(),
      753,
      6,
      true,
      (ERR, INV) => {
        if (!ERR) {
          let theirgems = 0;
          const inv = INV;
          const gems = [];
          let need = amountgems;
          for (let i = 0; i < INV.length; i += 1) {
            if (need !== 0) {
              if (
                acceptedKeys.steamGems.indexOf(inv[i].market_hash_name) >= 0
              ) {
                inv[i].amount = need <= inv[i].amount ? need : inv[i].amount;
                need -= inv[i].amount;
                theirgems += inv[i].amount;
                gems.push(inv[i]);
              }
            } else {
              break;
            }
          }
          if (theirgems < amountgems) {
            utils.chatMessage(
              client,
              sender,
              messages.ERROR.OUTOFSTOCK.DEFAULT.GEMS.THEM[1][
                users[sender.getSteamID64()].language
              ].replace('{GEMS}', theirgems)
            );
          } else {
            const message = messages.TRADE.SETMESSAGE[0].GEMS[
              users[sender.getSteamID64()].language
            ].replace('{GEMS}', amountgems);
            utils.makeOffer(
              client,
              users,
              manager,
              sender.getSteamID64(),
              [],
              gems,
              '!DEPOSITGEMS',
              message,
              0,
              0,
              0,
              amountgems
            );
          }
        } else if (ERR.message.indexOf('profile is private') > -1) {
          utils.chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.THEM[2][
              users[sender.getSteamID64()].language
            ]
          );
          utils.error(`An error occurred while getting user inventory: ${ERR}`);
        } else {
          utils.chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.THEM[0][
              users[sender.getSteamID64()].language
            ]
          );
          utils.error(`An error occurred while getting user inventory: ${ERR}`);
        }
      }
    );
  } else {
    utils.chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.GEMS[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!DEPOSITGEMS 1')
    );
  }
};
