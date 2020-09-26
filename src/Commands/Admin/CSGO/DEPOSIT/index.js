const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');
const acceptedKeys = require('../../../../Config/keys');

module.exports = (sender, msg, client, users, manager) => {
  const amountkeys = parseInt(
    msg.toUpperCase().replace('!DEPOSITCSGO ', ''),
    10
  );
  if (!Number.isNaN(amountkeys) && parseInt(amountkeys, 10) > 0) {
    utils.adminChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !DEPOSITCSGO ${amountkeys} ]`
    );
    utils.chatMessage(
      client,
      sender,
      messages.REQUEST[users[sender.getSteamID64()].language]
    );
    manager.getUserInventoryContents(
      sender.getSteamID64(),
      730,
      2,
      true,
      (ERR, INV) => {
        if (!ERR) {
          const theirKeys = [];
          for (let i = 0; i < INV.length; i += 1) {
            if (
              theirKeys.length < amountkeys &&
              acceptedKeys.csgo.indexOf(INV[i].market_hash_name) >= 0
            ) {
              theirKeys.push(INV[i]);
            }
          }
          if (theirKeys.length < amountkeys) {
            utils.chatMessage(
              client,
              sender,
              messages.ERROR.OUTOFSTOCK.DEFAULT.CSGO.THEM[1][
                users[sender.getSteamID64()].language
              ].replace('{CSGO}', theirKeys.length)
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
              [],
              theirKeys,
              '!DEPOSITCSGO',
              message,
              0,
              0,
              amountkeys,
              0
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
      messages.ERROR.INPUT.INVALID.CSGO[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!DEPOSITCSGO 1')
    );
  }
};
