const SID64REGEX = new RegExp(/^[0-9]{17}$/);

const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');

module.exports = (sender, msg, client, users) => {
  const n = msg.toUpperCase().replace('!UNBLOCK ', '').toString();
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    `[ !UNBLOCK ${n} ]`
  );
  if (SID64REGEX.test(n)) {
    if (n !== sender.getSteamID64()) {
      client.unblockUser(n, (err) => {
        if (err) {
          utils.chatMessage(
            client,
            sender,
            messages.UNBLOCK.ERROR[users[sender.getSteamID64()].language]
          );
          utils.error(`An error occured while unblocking user: ${err}`);
        } else {
          utils.chatMessage(
            client,
            sender,
            messages.UNBLOCK.RESPONSE[users[sender.getSteamID64()].language]
          );
        }
      });
    } else {
      utils.chatMessage(
        client,
        sender,
        messages.UNBLOCK.NOTALLOWED[users[sender.getSteamID64()].language]
      );
    }
  } else {
    utils.chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.STEAMID64[
        users[sender.getSteamID64()].language
      ]
    );
  }
};
