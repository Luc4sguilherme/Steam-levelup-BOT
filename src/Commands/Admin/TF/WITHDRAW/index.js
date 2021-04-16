const messages = require('../../../../Config/messages');
const acceptedCurrencies = require('../../../../Config/currencies');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users, manager) => {
  const amountkeys = parseInt(
    msg.toUpperCase().replace('!WITHDRAWTF ', ''),
    10
  );
  if (!Number.isNaN(amountkeys) && parseInt(amountkeys, 10) > 0) {
    log.adminChat(
      sender.getSteamID64(),
      utils.getLanguage(sender.getSteamID64(), users),
      `[ !WITHDRAWTF ${amountkeys} ]`
    );
    chatMessage(
      client,
      sender,
      messages.REQUEST[utils.getLanguage(sender.getSteamID64(), users)]
    );
    manager.getInventoryContents(440, 2, true, (ERR, INV) => {
      if (ERR) {
        chatMessage(
          client,
          sender,
          messages.ERROR.LOADINVENTORY.US[
            utils.getLanguage(sender.getSteamID64(), users)
          ]
        );
        log.error(`An error occurred while getting inventory: ${ERR}`);
      } else {
        let botkeys = 0;
        let added = 0;
        const myKeys = [];
        for (let i = 0; i < INV.length; i += 1) {
          if (acceptedCurrencies.tf.indexOf(INV[i].market_hash_name) >= 0) {
            botkeys += 1;
            if (added < amountkeys) {
              myKeys.push(INV[i]);
              added += 1;
            }
          }
        }
        if (botkeys < amountkeys) {
          chatMessage(
            client,
            sender,
            messages.ERROR.OUTOFSTOCK.DEFAULT.TF.US[1][
              utils.getLanguage(sender.getSteamID64(), users)
            ].replace('{TF}', botkeys)
          );
        } else {
          const message = messages.TRADE.SETMESSAGE[0].TF[
            utils.getLanguage(sender.getSteamID64(), users)
          ].replace('{TF}', amountkeys);
          makeOffer(
            client,
            users,
            manager,
            sender.getSteamID64(),
            myKeys,
            [],
            '!WITHDRAWTF',
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
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.TF[
        utils.getLanguage(sender.getSteamID64(), users)
      ].replace('{command}', '!WITHDRAWTF 1')
    );
  }
};
