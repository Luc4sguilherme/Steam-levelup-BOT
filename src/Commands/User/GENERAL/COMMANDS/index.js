const log = require('../../../../Components/log');
const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const { filterCommands } = require('../../../../Utils');

module.exports = (sender, client, users, lang) => {
  const language = lang || users[sender.getSteamID64()].language;
  const msg = filterCommands(messages.COMMANDS[language]);

  log.userChat(sender.getSteamID64(), language, '[ !COMMANDS ]');

  let message = '/pre ';
  for (let i = 0; i < msg.length; i += 1) {
    message += msg[i];
  }
  chatMessage(client, sender, message);
};
