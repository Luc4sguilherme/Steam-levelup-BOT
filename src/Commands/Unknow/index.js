const chatMessage = require('../../Components/message');
const main = require('../../Config/main');
const messages = require('../../Config/messages');

module.exports = (sender, client, users) => {
  if (main.admins.includes(sender.getSteamID64())) {
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
