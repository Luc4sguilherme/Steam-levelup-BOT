const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !REPORT ]'
  );
  const n = msg.substring('!REPORT'.length).trim();
  if (n.length > 0) {
    for (let j = 0; j < main.admins.length; j += 1) {
      chatMessage(
        client,
        main.admins[j],
        messages.REPORT.RESPONSE[0][users[main.admins[j]].language]
          .replace(
            '{USERNAME}',
            client.users[sender.getSteamID64()].player_name
          )
          .replace('{ID64}', sender.getSteamID64())
          .replace('{MESSAGE}', n)
      );
    }
    chatMessage(
      client,
      sender,
      messages.REPORT.RESPONSE[1][users[sender.getSteamID64()].language]
    );
  } else {
    chatMessage(
      client,
      sender,
      messages.REPORT.ERROR[users[sender.getSteamID64()].language]
    );
  }
};
