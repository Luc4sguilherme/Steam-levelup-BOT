const log = require('../../../../Components/log');
const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const { filterCommands } = require('../../../../Utils');

module.exports = (sender, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    `${users[sender.getSteamID64()].language}`,
    '[ !LANG ]'
  );
  let message = '';
  for (
    let i = 0;
    i < messages.LANGUAGE[users[sender.getSteamID64()].language].length;
    i += 1
  ) {
    message += messages.LANGUAGE[users[sender.getSteamID64()].language][i];
  }

  message = `/pre ${filterCommands(message).join('\n')}`;
  chatMessage(client, sender, message);
};
