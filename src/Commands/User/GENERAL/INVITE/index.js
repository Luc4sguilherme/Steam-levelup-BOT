const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils');
const log = require('../../../../Components/log');

module.exports = (sender, client, users, community) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  chatMessage(client, sender, messages.REQUEST[language]);
  log.userChat(sender.getSteamID64(), language, '[ !INVITE ]');
  utils.checkUserinGroup(community, sender.getSteamID64(), (err, isMember) => {
    if (!err) {
      if (!isMember) {
        client.inviteToGroup(sender.getSteamID64(), main.steamGroup.ID);
        chatMessage(
          client,
          sender.getSteamID64(),
          messages.INVITETOGROUP.INVITED[language]
        );
      } else {
        chatMessage(
          client,
          sender.getSteamID64(),
          messages.INVITETOGROUP.ITSALREADY[language]
        );
      }
    } else {
      chatMessage(
        client,
        sender.getSteamID64(),
        messages.INVITETOGROUP.ERROR[language]
      );
      log.error(`An error occurred inviting user to steam group: ${err}`);
    }
  });
};
