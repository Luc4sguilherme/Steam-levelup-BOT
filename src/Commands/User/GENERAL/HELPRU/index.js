const log = require('../../../../Components/log');
const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');

module.exports = (sender, client) => {
  log.userChat(sender.getSteamID64(), 'RU', '[ !HELP ]');
  let message = '/pre ';
  for (let i = 0; i < messages.HELP.RU.length; i += 1) {
    message += messages.HELP.RU[i];
  }
  chatMessage(client, sender, message);
};
