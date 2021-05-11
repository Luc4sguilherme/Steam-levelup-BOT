const messages = require('../../../../Config/messages');
const acceptedCurrencies = require('../../../../Config/currencies');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users, manager) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  const amountgems = parseInt(
    msg.toUpperCase().replace('!DEPOSITGEMS ', ''),
    10
  );
  if (!Number.isNaN(amountgems) && parseInt(amountgems, 10) > 0) {
    log.adminChat(
      sender.getSteamID64(),
      language,
      `[ !DEPOSITGEMS ${amountgems} ]`
    );
    chatMessage(client, sender, messages.REQUEST[language]);
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
                acceptedCurrencies.steamGems.indexOf(inv[i].market_hash_name) >=
                0
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
            chatMessage(
              client,
              sender,
              messages.ERROR.OUTOFSTOCK.DEFAULT.GEMS.THEM[1][language].replace(
                '{GEMS}',
                theirgems
              )
            );
          } else {
            const message = messages.TRADE.SETMESSAGE[0].GEMS[language].replace(
              '{GEMS}',
              amountgems
            );
            makeOffer(
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
          chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.THEM[2][language]
          );
          log.error(`An error occurred while getting user inventory: ${ERR}`);
        } else {
          chatMessage(
            client,
            sender,
            messages.ERROR.LOADINVENTORY.THEM[0][language]
          );
          log.error(`An error occurred while getting user inventory: ${ERR}`);
        }
      }
    );
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.GEMS[language].replace(
        '{command}',
        '!DEPOSITGEMS 1'
      )
    );
  }
};
