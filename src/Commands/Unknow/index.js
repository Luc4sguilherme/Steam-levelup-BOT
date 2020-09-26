const chatMessage = require('../../Components/message');
const main = require('../../Config/main');
const messages = require('../../Config/messages');

module.exports = (sender, client, users) => {
  if (
    main.admins.indexOf(sender.getSteamID64()) >= 0 ||
    main.admins.indexOf(parseInt(sender.getSteamID64(), 10)) >= 0
  ) {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.UNKNOW.ADMIN[users[sender.getSteamID64()].language]
    );
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.UNKNOW.CUSTOMER[
        users[sender.getSteamID64()].language
      ]
    );
  }
};
