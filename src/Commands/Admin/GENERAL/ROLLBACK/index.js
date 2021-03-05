const log = require('../../../../Components/log');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users, community, manager) => {
  const offerID = msg.substring('!ROLLBACK'.length).trim();

  if (offerID) {
    log.adminChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !ROLLBACK ${offerID} ]`
    );
    manager.getOffer(offerID, async (error, offer) => {
      if (error) {
        chatMessage(
          client,
          sender,
          messages.ERROR.GETOFFER[users[sender.getSteamID64()].language]
        );
        log.error(`There was an error getting offers: ${error}`);
      } else {
        let itemsSent = [];
        let itemsReceived = [];

        try {
          if (offer.itemsToGive.length > 0) {
            itemsSent = await utils.getExchangedItems(
              community,
              offer.partner.getSteamID64(),
              offer.itemsToGive[0].appid,
              offer.itemsToGive[0].contextid,
              offer.itemsToGive,
              'USER'
            );
          }

          if (offer.itemsToReceive.length > 0) {
            itemsReceived = await utils.getExchangedItems(
              community,
              client.steamID.getSteamID64(),
              offer.itemsToReceive[0].appid,
              offer.itemsToReceive[0].contextid,
              offer.itemsToReceive,
              'BOT'
            );
          }

          makeOffer(
            client,
            users,
            manager,
            offer.partner.getSteamID64(),
            [].concat(...itemsReceived),
            [].concat(...itemsSent),
            '!ROLLBACK',
            messages.TRADE.SETMESSAGE[0].ROLLBACK[
              users[offer.partner.getSteamID64()].language
            ].replace('{OFFERID}', offer.id),
            offer.data('amountofsets'),
            offer.data('amountofleftovers'),
            offer.data('amountofkeys'),
            offer.data('amountofgems')
          );
        } catch (error1) {
          log.error(`There was an error getting items: ${error1}`);

          if (error1.message.indexOf('items are unavailable') > -1) {
            chatMessage(
              client,
              sender,
              messages.TRADE.UNAVAILABLEITEMS[
                users[sender.getSteamID64()].language
              ]
            );
          } else {
            chatMessage(
              client,
              sender,
              messages.ERROR.GETITEMS[users[sender.getSteamID64()].language]
            );
          }
        }
      }
    });
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.OFFERID[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!ROLLBACK offerID')
    );
  }
};
