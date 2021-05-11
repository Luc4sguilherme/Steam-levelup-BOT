const SID64REGEX = new RegExp(/^[0-9]{17}$/);

const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  const n = msg.toUpperCase().replace('!UNBLOCK ', '').toString();

  log.adminChat(sender.getSteamID64(), language, `[ !UNBLOCK ${n} ]`);
  if (SID64REGEX.test(n)) {
    if (n !== sender.getSteamID64()) {
      client.unblockUser(n, (err) => {
        if (err) {
          chatMessage(client, sender, messages.UNBLOCK.ERROR[language]);
          log.error(`An error occured while unblocking user: ${err}`);
        } else {
          chatMessage(client, sender, messages.UNBLOCK.RESPONSE[language]);
        }
      });
    } else {
      chatMessage(client, sender, messages.UNBLOCK.NOTALLOWED[language]);
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.STEAMID64[language]
    );
  }
};
