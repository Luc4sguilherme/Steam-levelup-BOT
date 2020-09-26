const SID64REGEX = new RegExp(/^[0-9]{17}$/);

const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users) => {
  const n = msg.toUpperCase().replace('!UNBLOCK ', '').toString();
  log.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    `[ !UNBLOCK ${n} ]`
  );
  if (SID64REGEX.test(n)) {
    if (n !== sender.getSteamID64()) {
      client.unblockUser(n, (err) => {
        if (err) {
          chatMessage(
            client,
            sender,
            messages.UNBLOCK.ERROR[users[sender.getSteamID64()].language]
          );
          log.error(`An error occured while unblocking user: ${err}`);
        } else {
          chatMessage(
            client,
            sender,
            messages.UNBLOCK.RESPONSE[users[sender.getSteamID64()].language]
          );
        }
      });
    } else {
      chatMessage(
        client,
        sender,
        messages.UNBLOCK.NOTALLOWED[users[sender.getSteamID64()].language]
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.STEAMID64[
        users[sender.getSteamID64()].language
      ]
    );
  }
};
