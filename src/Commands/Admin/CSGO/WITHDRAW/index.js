const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');
const acceptedKeys = require('../../../../Config/keys');

module.exports = (sender, msg, client, users, manager) => {
  const amountkeys = parseInt(
    msg.toUpperCase().replace('!WITHDRAWCSGO ', ''),
    10
  );
  if (!Number.isNaN(amountkeys) && parseInt(amountkeys, 10) > 0) {
    utils.adminChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !WITHDRAWCSGO ${amountkeys} ]`
    );
    utils.chatMessage(
      client,
      sender,
      messages.REQUEST[users[sender.getSteamID64()].language]
    );
    manager.getInventoryContents(730, 2, true, (ERR, INV) => {
      if (ERR) {
        utils.chatMessage(
          client,
          sender,
          messages.ERROR.LOADINVENTORY.US[users[sender.getSteamID64()].language]
        );
        utils.error(`An error occurred while getting inventory: ${ERR}`);
      } else {
        let botkeys = 0;
        let added = 0;
        const myKeys = [];
        for (let i = 0; i < INV.length; i += 1) {
          if (acceptedKeys.csgo.indexOf(INV[i].market_hash_name) >= 0) {
            botkeys += 1;
            if (added < amountkeys) {
              myKeys.push(INV[i]);
              added += 1;
            }
          }
        }
        if (botkeys < amountkeys) {
          utils.chatMessage(
            client,
            sender,
            messages.ERROR.OUTOFSTOCK.DEFAULT.CSGO.US[1][
              users[sender.getSteamID64()].language
            ].replace('{CSGO}', botkeys)
          );
        } else {
          const message = messages.TRADE.SETMESSAGE[0].CSGO[
            users[sender.getSteamID64()].language
          ].replace('{CSGO}', amountkeys);
          utils.makeOffer(
            client,
            users,
            manager,
            sender.getSteamID64(),
            myKeys,
            [],
            '!WITHDRAWCSGO',
            message,
            0,
            0,
            amountkeys,
            0
          );
        }
      }
    });
  } else {
    utils.chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.CSGO[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!WITHDRAWCSGO 1')
    );
  }
};
