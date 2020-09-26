const log = require('../../../../Components/log');
const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');

module.exports = (sender, client) => {
  log.userChat(sender.getSteamID64(), 'CN', '[ !HELP ]');
  let message = '/pre ';
  for (let i = 0; i < messages.HELP.CN.length; i += 1) {
    message += messages.HELP.CN[i];
  }
  chatMessage(client, sender, message);
};
