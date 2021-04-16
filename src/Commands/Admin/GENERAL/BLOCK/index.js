const SID64REGEX = new RegExp(/^[0-9]{17}$/);

const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users) => {
  const n = msg.toUpperCase().replace('!BLOCK ', '').toString();
  log.adminChat(
    sender.getSteamID64(),
    utils.getLanguage(sender.getSteamID64(), users),
    `[ !BLOCK ${n} ]`
  );
  if (SID64REGEX.test(n)) {
    if (n !== sender.getSteamID64()) {
      client.blockUser(n, (err) => {
        if (err) {
          chatMessage(
            client,
            sender,
            messages.BLOCK.ERROR[
              utils.getLanguage(sender.getSteamID64(), users)
            ]
          );
          log.error(`An error occured while blocking user: ${err}`);
        } else {
          chatMessage(
            client,
            sender,
            messages.BLOCK.RESPONSE[
              utils.getLanguage(sender.getSteamID64(), users)
            ]
          );
        }
      });
      client.removeFriend(n);
    } else {
      chatMessage(
        client,
        sender,
        messages.BLOCK.NOTALLOWED[
          utils.getLanguage(sender.getSteamID64(), users)
        ]
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.STEAMID64[
        utils.getLanguage(sender.getSteamID64(), users)
      ]
    );
  }
};
