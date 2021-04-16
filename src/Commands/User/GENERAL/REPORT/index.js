const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    utils.getLanguage(sender.getSteamID64(), users),
    '[ !REPORT ]'
  );
  const n = msg.substring('!REPORT'.length).trim();
  if (n.length > 0) {
    for (let j = 0; j < main.admins.length; j += 1) {
      chatMessage(
        client,
        main.admins[j],
        messages.REPORT.RESPONSE[0][utils.getLanguage(main.admins[j], users)]
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
      messages.REPORT.RESPONSE[1][
        utils.getLanguage(sender.getSteamID64(), users)
      ]
    );
  } else {
    chatMessage(
      client,
      sender,
      messages.REPORT.ERROR[utils.getLanguage(sender.getSteamID64(), users)]
    );
  }
};
