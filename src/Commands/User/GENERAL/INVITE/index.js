const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils');
const log = require('../../../../Components/log');

module.exports = (sender, client, users, community) => {
  chatMessage(
    client,
    sender,
    messages.REQUEST[utils.getLanguage(sender.getSteamID64(), users)]
  );
  log.userChat(
    sender.getSteamID64(),
    utils.getLanguage(sender.getSteamID64(), users),
    '[ !INVITE ]'
  );
  utils.checkUserinGroup(community, sender.getSteamID64(), (err, isMember) => {
    if (!err) {
      if (!isMember) {
        client.inviteToGroup(sender.getSteamID64(), main.steamGroup.ID);
        chatMessage(
          client,
          sender.getSteamID64(),
          messages.INVITETOGROUP.INVITED[
            utils.getLanguage(sender.getSteamID64(), users)
          ]
        );
      } else {
        chatMessage(
          client,
          sender.getSteamID64(),
          messages.INVITETOGROUP.ITSALREADY[
            utils.getLanguage(sender.getSteamID64(), users)
          ]
        );
      }
    } else {
      chatMessage(
        client,
        sender.getSteamID64(),
        messages.INVITETOGROUP.ERROR[
          utils.getLanguage(sender.getSteamID64(), users)
        ]
      );
      log.error(`An error occurred inviting user to steam group: ${err}`);
    }
  });
};
