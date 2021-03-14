const messages = require('../../../../Config/messages');
const acceptedCurrencies = require('../../../../Config/currencies');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users, manager) => {
  const amountkeys = parseInt(msg.toUpperCase().replace('!DEPOSITTF ', ''), 10);
  if (!Number.isNaN(amountkeys) && parseInt(amountkeys, 10) > 0) {
    log.adminChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !DEPOSITTF ${amountkeys} ]`
    );
    chatMessage(
      client,
      sender,
      messages.REQUEST[users[sender.getSteamID64()].language]
    );
    manager.getUserInventoryContents(
      sender.getSteamID64(),
      440,
      2,
      true,
      (ERR, INV) => {
        if (!ERR) {
          const theirKeys = [];
          for (let i = 0; i < INV.length; i += 1) {
            if (
              theirKeys.length < amountkeys &&
              acceptedCurrencies.tf.indexOf(INV[i].market_hash_name) >= 0
            ) {
              theirKeys.push(INV[i]);
            }
          }
          if (theirKeys.length < amountkeys) {
            chatMessage(
              client,
              sender,
              messages.ERROR.OUTOFSTOCK.DEFAULT.TF.THEM[1][
                users[sender.getSteamID64()].language
              ].replace('{TF}', theirKeys.length)
            );
          } else {
            const message = messages.TRADE.SETMESSAGE[0].TF[
              users[sender.getSteamID64()].language
            ].replace('{TF}', amountkeys);
            makeOffer(
              client,
              users,
              manager,
              sender.getSteamID64(),
              [],
              theirKeys,
              '!DEPOSITTF',
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
              users[sender.getSteamID64()].language
            ]
          );
          log.error(`An error occurred while getting user inventory: ${ERR}`);
        } else {
          chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.THEM[0][
              users[sender.getSteamID64()].language
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
      messages.ERROR.INPUT.INVALID.TF[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!DEPOSITTF 1')
    );
  }
};
