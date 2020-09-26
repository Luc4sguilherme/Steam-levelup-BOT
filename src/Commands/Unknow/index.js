const main = require('../../Config/main');
const messages = require('../../Config/messages');
const utils = require('../../Utils/utils');

module.exports = (sender, client, users) => {
  if (
    main.admins.indexOf(sender.getSteamID64()) >= 0 ||
    main.admins.indexOf(parseInt(sender.getSteamID64(), 10)) >= 0
  ) {
    utils.chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.UNKNOW.ADMIN[users[sender.getSteamID64()].language]
    );
  } else {
    utils.chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.UNKNOW.CUSTOMER[
        users[sender.getSteamID64()].language
      ]
    );
  }
};
