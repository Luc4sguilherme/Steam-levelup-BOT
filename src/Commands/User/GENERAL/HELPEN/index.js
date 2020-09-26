const log = require('../../../../Components/log');
const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');

module.exports = (sender, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !HELP ]'
  );
  let message = '/pre ';
  for (
    let i = 0;
    i < messages.HELP[users[sender.getSteamID64()].language].length;
    i += 1
  ) {
    message += messages.HELP[users[sender.getSteamID64()].language][i];
  }
  chatMessage(client, sender, message);
};
