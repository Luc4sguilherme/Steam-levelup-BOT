const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');

module.exports = (sender, client, users) => {
  utils.userChat(
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
  utils.chatMessage(client, sender, message);
};
