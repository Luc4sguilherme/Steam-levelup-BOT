const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users, manager) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  const amountbooster = parseInt(
    msg.toUpperCase().replace('!WITHDRAWBOOSTER ', ''),
    10
  );
  if (!Number.isNaN(amountbooster) && parseInt(amountbooster, 10) > 0) {
    log.adminChat(
      sender.getSteamID64(),
      language,
      `[ !WITHDRAWBOOSTER ${amountbooster} ]`
    );
    chatMessage(client, sender, messages.REQUEST[language]);
    manager.getInventoryContents(753, 6, true, (ERR, INV) => {
      if (ERR) {
        chatMessage(client, sender, messages.ERROR.LOADINVENTORY.US[language]);
        log.error(`An error occurred while getting inventory: ${ERR}`);
      } else {
        const botBooster = [];
        for (let i = 0; i < INV.length; i += 1) {
          if (
            botBooster.length < amountbooster &&
            INV[i].type === 'Booster Pack'
          ) {
            botBooster.push(INV[i]);
          }
        }
        if (botBooster.length < amountbooster) {
          chatMessage(
            client,
            sender,
            messages.ERROR.OUTOFSTOCK.DEFAULT.BOOSTER.US[language].replace(
              '{BOOSTER}',
              botBooster.length
            )
          );
        } else {
          const message = messages.TRADE.SETMESSAGE[0].BOOSTER[
            language
          ].replace('{BOOSTER}', amountbooster.toString());
          makeOffer(
            client,
            users,
            manager,
            sender.getSteamID64(),
            botBooster,
            [],
            '!WITHDRAWBOOSTER',
            message,
            0,
            0,
            0,
            0
          );
        }
      }
    });
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.BOOSTER[language].replace(
        '{command}',
        '!WITHDRAWBOOSTER 1'
      )
    );
  }
};
