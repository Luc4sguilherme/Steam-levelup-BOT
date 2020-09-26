const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');
const acceptedKeys = require('../../../../Config/keys');

module.exports = (sender, msg, client, users, manager) => {
  const amountgems = parseInt(
    msg.toUpperCase().replace('!WITHDRAWGEMS ', ''),
    10
  );
  if (!Number.isNaN(amountgems) && parseInt(amountgems, 10) > 0) {
    utils.chatMessage(
      client,
      sender,
      messages.REQUEST[users[sender.getSteamID64()].language]
    );
    manager.getInventoryContents(753, 6, true, (ERR, INV) => {
      utils.adminChat(
        sender.getSteamID64(),
        users[sender.getSteamID64()].language,
        `[ !WITHDRAWGEMS ${amountgems} ]`
      );
      if (ERR) {
        utils.chatMessage(
          client,
          sender,
          messages.ERROR.LOADINVENTORY.US[users[sender.getSteamID64()].language]
        );
        utils.error(`An error occurred while getting inventory: ${ERR}`);
      } else {
        let botgems = 0;
        const inv = INV;
        const myGems = [];
        let need = amountgems;
        for (let i = 0; i < inv.length; i += 1) {
          if (need !== 0) {
            if (acceptedKeys.steamGems.indexOf(inv[i].market_hash_name) >= 0) {
              inv[i].amount = need <= inv[i].amount ? need : inv[i].amount;
              need -= inv[i].amount;
              botgems += inv[i].amount;
              myGems.push(inv[i]);
            }
          } else {
            break;
          }
        }
        if (botgems < amountgems) {
          utils.chatMessage(
            client,
            sender,
            messages.ERROR.OUTOFSTOCK.DEFAULT.GEMS.US[1][
              users[sender.getSteamID64()].language
            ].replace('{GEMS}', botgems)
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
            myGems,
            [],
            '!WITHDRAWGEMS',
            message,
            0,
            0,
            0,
            amountgems
          );
        }
      }
    });
  } else {
    utils.chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.GEMS[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!WITHDRAWGEMS 1')
    );
  }
};
