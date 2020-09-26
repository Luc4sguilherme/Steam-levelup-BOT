const chatMessage = require('../../../../Components/message');
const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');

module.exports = (sender, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !KEYLIST ]'
  );
  let message = '/pre ';
  message +=
    messages.KEYLIST.MESSAGES[0][users[sender.getSteamID64()].language];
  message +=
    messages.KEYLIST.MESSAGES[1][users[sender.getSteamID64()].language];
  for (
    let i = 0;
    i <
    messages.KEYLIST.ACCEPTED.CSGO[users[sender.getSteamID64()].language]
      .length;
    i += 1
  ) {
    message +=
      messages.KEYLIST.ACCEPTED.CSGO[users[sender.getSteamID64()].language][i];
  }
  message +=
    messages.KEYLIST.MESSAGES[2][users[sender.getSteamID64()].language];
  for (
    let j = 0;
    j <
    messages.KEYLIST.ACCEPTED.TF[users[sender.getSteamID64()].language].length;
    j += 1
  ) {
    message +=
      messages.KEYLIST.ACCEPTED.TF[users[sender.getSteamID64()].language][j];
  }
  chatMessage(client, sender, message);
};
