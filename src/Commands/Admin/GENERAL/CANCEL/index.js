const log = require('../../../../Components/log');
const chatMessage = require('../../../../Components/message');
const messages = require('../../../../Config/messages');

module.exports = (sender, msg, client, users, manager) => {
  const offerID = msg.substring('!CANCEL'.length).trim();

  if (offerID) {
    log.adminChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !CANCEL ${offerID} ]`
    );

    manager.getOffer(offerID, (error1, offer) => {
      if (error1) {
        chatMessage(
          client,
          sender,
          messages.ERROR.GETOFFER[users[sender.getSteamID64()].language]
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
                  users[sender.getSteamID64()].language
                ].replace('{OFFERID}', offerID)
              );
            } else {
              chatMessage(
                client,
                sender,
                messages.ERROR.CANCELOFFER[
                  users[sender.getSteamID64()].language
                ]
              );
            }

            log.error(`An error occurred while declining trade: ${error2}`);
          } else {
            chatMessage(
              client,
              sender,
              messages.TRADE.CANCELED[
                users[sender.getSteamID64()].language
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
        users[sender.getSteamID64()].language
      ].replace('{command}', '!CANCEL offerID')
    );
  }
};
