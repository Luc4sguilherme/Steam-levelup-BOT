const SID64REGEX = new RegExp(/^[0-9]{17}$/);

const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  const n = msg.toUpperCase().replace('!BLOCK ', '').toString();

  log.adminChat(sender.getSteamID64(), language, `[ !BLOCK ${n} ]`);
  if (SID64REGEX.test(n)) {
    if (n !== sender.getSteamID64()) {
      client.blockUser(n, (err) => {
        if (err) {
          chatMessage(client, sender, messages.BLOCK.ERROR[language]);
          log.error(`An error occured while blocking user: ${err}`);
        } else {
          chatMessage(client, sender, messages.BLOCK.RESPONSE[language]);
        }
      });
      client.removeFriend(n);
    } else {
      chatMessage(client, sender, messages.BLOCK.NOTALLOWED[language]);
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.STEAMID64[language]
    );
  }
};
