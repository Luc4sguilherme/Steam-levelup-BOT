const log = require('../../../../Components/log');
const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const { filterCommands } = require('../../../../Utils');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);

  log.userChat(sender.getSteamID64(), `${language}`, '[ !LANG ]');
  let message = '';
  for (let i = 0; i < messages.LANGUAGE[language].length; i += 1) {
    message += messages.LANGUAGE[language][i];
  }

  message = `/pre ${filterCommands(message).join('\n')}`;
  chatMessage(client, sender, message);
};
