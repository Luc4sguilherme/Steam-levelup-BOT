const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');
const acceptedKeys = require('../../../../Config/keys');

module.exports = (sender, msg, client, users, manager) => {
  const amountkeys = parseInt(
    msg.toUpperCase().replace('!WITHDRAWHYDRA ', ''),
    10
  );
  if (!Number.isNaN(amountkeys) && parseInt(amountkeys, 10) > 0) {
    utils.adminChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !WITHDRAWHYDRA ${amountkeys} ]`
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
          if (acceptedKeys.hydra.indexOf(INV[i].market_hash_name) >= 0) {
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
            messages.ERROR.OUTOFSTOCK.DEFAULT.HYDRA.US[1][
              users[sender.getSteamID64()].language
            ].replace('{HYDRA}', botkeys)
          );
        } else {
          const message = messages.TRADE.SETMESSAGE[0].HYDRA[
            users[sender.getSteamID64()].language
          ].replace('{HYDRA}', amountkeys);
          utils.makeOffer(
            client,
            users,
            manager,
            sender.getSteamID64(),
            myKeys,
            [],
            '!WITHDRAWHYDRA',
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
      messages.ERROR.INPUT.INVALID.HYDRA[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!WITHDRAWHYDRA 1')
    );
  }
};
