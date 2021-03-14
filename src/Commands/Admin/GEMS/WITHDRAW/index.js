const messages = require('../../../../Config/messages');
const acceptedCurrencies = require('../../../../Config/currencies');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users, manager) => {
  const amountgems = parseInt(
    msg.toUpperCase().replace('!WITHDRAWGEMS ', ''),
    10
  );
  if (!Number.isNaN(amountgems) && parseInt(amountgems, 10) > 0) {
    chatMessage(
      client,
      sender,
      messages.REQUEST[users[sender.getSteamID64()].language]
    );
    manager.getInventoryContents(753, 6, true, (ERR, INV) => {
      log.adminChat(
        sender.getSteamID64(),
        users[sender.getSteamID64()].language,
        `[ !WITHDRAWGEMS ${amountgems} ]`
      );
      if (ERR) {
        chatMessage(
          client,
          sender,
          messages.ERROR.LOADINVENTORY.US[users[sender.getSteamID64()].language]
        );
        log.error(`An error occurred while getting inventory: ${ERR}`);
      } else {
        let botgems = 0;
        const inv = INV;
        const myGems = [];
        let need = amountgems;
        for (let i = 0; i < inv.length; i += 1) {
          if (need !== 0) {
            if (
              acceptedCurrencies.steamGems.indexOf(inv[i].market_hash_name) >= 0
            ) {
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
          chatMessage(
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
          makeOffer(
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
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.GEMS[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!WITHDRAWGEMS 1')
    );
  }
};
