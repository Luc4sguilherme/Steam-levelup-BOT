const log = require('../../../../Components/log');
const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');

module.exports = (sender, client) => {
  log.userChat(sender.getSteamID64(), 'JA', '[ !HELP ]');
  let message = '/pre ';
  for (let i = 0; i < messages.HELP.JA.length; i += 1) {
    message += messages.HELP.JA[i];
  }
  chatMessage(client, sender, message);
};
