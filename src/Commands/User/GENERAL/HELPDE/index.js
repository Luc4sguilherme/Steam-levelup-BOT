const log = require('../../../../Components/log');
const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');

module.exports = (sender, client) => {
  log.userChat(sender.getSteamID64(), 'DE', '[ !HELP ]');
  let message = '/pre ';
  for (let i = 0; i < messages.HELP.DE.length; i += 1) {
    message += messages.HELP.DE[i];
  }
  chatMessage(client, sender, message);
};
