const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const { filterCommands } = require('../../../../Utils');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  const msg = filterCommands(messages.ADMIN[language], true);

  log.adminChat(sender.getSteamID64(), language, '[ !ADMIN ]');

  let message = '/pre ';
  for (let i = 0; i < msg.length; i += 1) {
    message += msg[i];
  }
  chatMessage(client, sender, message);
};
