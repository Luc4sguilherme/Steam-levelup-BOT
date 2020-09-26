const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');

module.exports = (sender, client, users) => {
  utils.adminChat(
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
  utils.chatMessage(client, sender, message);
};
