const chatMessage = require('../../Components/message');
const main = require('../../Config/main');
const messages = require('../../Config/messages');
const utils = require('../../Utils');

module.exports = (sender, client, users) => {
  if (main.admins.includes(sender.getSteamID64())) {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.UNKNOW.ADMIN[
        utils.getLanguage(sender.getSteamID64(), users)
      ]
    );
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.UNKNOW.CUSTOMER[
        utils.getLanguage(sender.getSteamID64(), users)
      ]
    );
  }
};
