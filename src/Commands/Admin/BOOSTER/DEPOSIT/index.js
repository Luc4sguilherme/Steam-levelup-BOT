const chatMessage = require('../../../../Components/message');
const messages = require('../../../../Config/messages');
const makeOffer = require('../../../../Components/offer');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users, manager) => {
  const amountbooster = parseInt(
    msg.toUpperCase().replace('!DEPOSITBOOSTER ', ''),
    10
  );
  if (!Number.isNaN(amountbooster) && parseInt(amountbooster, 10) > 0) {
    log.adminChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !DEPOSITBOOSTER ${amountbooster} ]`
    );
    chatMessage(
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
          const theirbooster = [];
          for (let i = 0; i < INV.length; i += 1) {
            if (
              theirbooster.length < amountbooster &&
              INV[i].type === 'Booster Pack'
            ) {
              theirbooster.push(INV[i]);
            }
          }
          if (theirbooster.length < amountbooster) {
            chatMessage(
              client,
              sender,
              messages.ERROR.OUTOFSTOCK.DEFAULT.BOOSTER.THEM[
                users[sender.getSteamID64()].language
              ].replace('{BOOSTER}', theirbooster.length)
            );
          } else {
            const message = messages.TRADE.SETMESSAGE[0].BOOSTER[
              users[sender.getSteamID64()].language
            ].replace('{BOOSTER}', amountbooster.toString());
            makeOffer(
              client,
              users,
              manager,
              sender.getSteamID64(),
              [],
              theirbooster,
              '!DEPOSITBOOSTER',
              message,
              0,
              0,
              0,
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
      messages.ERROR.INPUT.INVALID.BOOSTER[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!DEPOSITBOOSTER 1')
    );
  }
};
