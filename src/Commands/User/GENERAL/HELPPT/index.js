const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');

module.exports = (sender, client) => {
  utils.userChat(sender.getSteamID64(), 'PT', '[ !HELP ]');
  let message = '/pre ';
  for (let i = 0; i < messages.HELP.PT.length; i += 1) {
    message += messages.HELP.PT[i];
  }
  utils.chatMessage(client, sender, message);
};
