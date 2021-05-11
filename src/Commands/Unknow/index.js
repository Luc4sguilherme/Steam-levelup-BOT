const chatMessage = require('../../Components/message');
const main = require('../../Config/main');
const messages = require('../../Config/messages');
const utils = require('../../Utils');

module.exports = (sender, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);

  if (main.admins.includes(sender.getSteamID64())) {
    chatMessage(client, sender, messages.ERROR.INPUT.UNKNOW.ADMIN[language]);
  } else {
    chatMessage(client, sender, messages.ERROR.INPUT.UNKNOW.CUSTOMER[language]);
  }
};
