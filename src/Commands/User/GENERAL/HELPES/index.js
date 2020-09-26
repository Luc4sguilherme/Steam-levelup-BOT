const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');

module.exports = (sender, client) => {
  utils.userChat(sender.getSteamID64(), 'ES', '[ !HELP ]');
  let message = '/pre ';
  for (let i = 0; i < messages.HELP.ES.length; i += 1) {
    message += messages.HELP.ES[i];
  }
  utils.chatMessage(client, sender, message);
};
