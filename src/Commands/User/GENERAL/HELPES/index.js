const chatMessage = require('../../../../Components/message');
const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');

module.exports = (sender, client) => {
  log.userChat(sender.getSteamID64(), 'ES', '[ !HELP ]');
  let message = '/pre ';
  for (let i = 0; i < messages.HELP.ES.length; i += 1) {
    message += messages.HELP.ES[i];
  }
  chatMessage(client, sender, message);
};
