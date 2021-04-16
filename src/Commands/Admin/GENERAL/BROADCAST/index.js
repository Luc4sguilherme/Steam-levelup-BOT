const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users) => {
  const n = msg.substring('!BROADCAST'.length).trim();
  if (n.length > 0) {
    log.adminChat(
      sender.getSteamID64(),
      utils.getLanguage(sender.getSteamID64(), users),
      `[ !BROADCAST ${n} ]`
    );
    for (let i = 0; i <= Object.keys(client.myFriends).length; i += 1) {
      if (Object.values(client.myFriends)[i] === 3) {
        chatMessage(client, Object.keys(client.myFriends)[i], `/pre ${n}`);
      }
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.MESSAGE[
        utils.getLanguage(sender.getSteamID64(), users)
      ]
    );
  }
};
