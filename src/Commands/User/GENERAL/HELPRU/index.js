const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');

module.exports = (sender, client) => {
  utils.userChat(sender.getSteamID64(), 'RU', '[ !HELP ]');
  let message = '/pre ';
  for (let i = 0; i < messages.HELP.RU.length; i += 1) {
    message += messages.HELP.RU[i];
  }
  utils.chatMessage(client, sender, message);
};
