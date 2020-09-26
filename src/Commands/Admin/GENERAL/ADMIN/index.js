const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');

module.exports = (sender, client, users) => {
  log.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !ADMIN ]'
  );
  let message = '/pre ';
  for (
    let i = 0;
    i < messages.ADMIN[users[sender.getSteamID64()].language].length;
    i += 1
  ) {
    message += messages.ADMIN[users[sender.getSteamID64()].language][i];
  }
  chatMessage(client, sender, message);
};
