const log = require('../../../../Components/log');
const chatMessage = require('../../../../Components/message');
const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users, manager) => {
  const offerID = msg.substring('!CANCEL'.length).trim();

  if (offerID) {
    log.adminChat(
      sender.getSteamID64(),
      utils.getLanguage(sender.getSteamID64(), users),
      `[ !CANCEL ${offerID} ]`
    );

    manager.getOffer(offerID, (error1, offer) => {
      if (error1) {
        chatMessage(
          client,
          sender,
          messages.ERROR.GETOFFER[
            utils.getLanguage(sender.getSteamID64(), users)
          ]
        );
        log.error(`There was an error getting offers: ${error1}`);
      } else {
        offer.decline((error2) => {
          if (error2) {
            if (
              error2.message.indexOf(
                `Offer #${offerID} is not active, so it may not be cancelled or declined`
              ) > -1
            ) {
              chatMessage(
                client,
                sender,
                messages.ERROR.NONEXISTENTOFFER[
                  utils.getLanguage(sender.getSteamID64(), users)
                ].replace('{OFFERID}', offerID)
              );
            } else {
              chatMessage(
                client,
                sender,
                messages.ERROR.CANCELOFFER[
                  utils.getLanguage(sender.getSteamID64(), users)
                ]
              );
            }

            log.error(`An error occurred while declining trade: ${error2}`);
          } else {
            chatMessage(
              client,
              sender,
              messages.TRADE.CANCELED[
                utils.getLanguage(sender.getSteamID64(), users)
              ].replace('{OFFERID}', offer.id)
            );
          }
        });
      }
    });
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.OFFERID[
        utils.getLanguage(sender.getSteamID64(), users)
      ].replace('{command}', '!CANCEL offerID')
    );
  }
};
