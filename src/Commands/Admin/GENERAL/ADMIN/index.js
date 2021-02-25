const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const { filterCommands } = require('../../../../Utils');

module.exports = (sender, client, users) => {
  const { language } = users[sender.getSteamID64()];
  const msg = filterCommands(messages.ADMIN[language]);

  log.adminChat(sender.getSteamID64(), language, '[ !ADMIN ]');

  let message = '/pre ';
  for (let i = 0; i < msg.length; i += 1) {
    message += msg[i];
  }
  chatMessage(client, sender, message);
};
