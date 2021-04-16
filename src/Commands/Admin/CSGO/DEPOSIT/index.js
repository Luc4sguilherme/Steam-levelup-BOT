const messages = require('../../../../Config/messages');
const acceptedCurrencies = require('../../../../Config/currencies');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users, manager) => {
  const amountkeys = parseInt(
    msg.toUpperCase().replace('!DEPOSITCSGO ', ''),
    10
  );
  if (!Number.isNaN(amountkeys) && parseInt(amountkeys, 10) > 0) {
    log.adminChat(
      sender.getSteamID64(),
      utils.getLanguage(sender.getSteamID64(), users),
      `[ !DEPOSITCSGO ${amountkeys} ]`
    );
    chatMessage(
      client,
      sender,
      messages.REQUEST[utils.getLanguage(sender.getSteamID64(), users)]
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
              acceptedCurrencies.csgo.indexOf(INV[i].market_hash_name) >= 0
            ) {
              theirKeys.push(INV[i]);
            }
          }
          if (theirKeys.length < amountkeys) {
            chatMessage(
              client,
              sender,
              messages.ERROR.OUTOFSTOCK.DEFAULT.CSGO.THEM[1][
                utils.getLanguage(sender.getSteamID64(), users)
              ].replace('{CSGO}', theirKeys.length)
            );
          } else {
            const message = messages.TRADE.SETMESSAGE[0].CSGO[
              utils.getLanguage(sender.getSteamID64(), users)
            ].replace('{CSGO}', amountkeys);
            makeOffer(
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
          chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.THEM[2][
              utils.getLanguage(sender.getSteamID64(), users)
            ]
          );
          log.error(`An error occurred while getting user inventory: ${ERR}`);
        } else {
          chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.THEM[0][
              utils.getLanguage(sender.getSteamID64(), users)
            ]
          );
          log.error(`An error occurred while getting user inventory: ${ERR}`);
        }
      }
    );
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.CSGO[
        utils.getLanguage(sender.getSteamID64(), users)
      ].replace('{command}', '!DEPOSITCSGO 1')
    );
  }
};
