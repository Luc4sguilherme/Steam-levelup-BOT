const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');

module.exports = (sender, client, users, community) => {
  utils.chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  utils.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !INVITE ]'
  );
  utils.checkUserinGroup(community, sender.getSteamID64(), (err, isMember) => {
    if (!err) {
      if (!isMember) {
        client.inviteToGroup(sender.getSteamID64(), main.groupID);
        utils.chatMessage(
          client,
          sender.getSteamID64(),
          messages.INVITETOGROUP.INVITED[users[sender.getSteamID64()].language]
        );
      } else {
        utils.chatMessage(
          client,
          sender.getSteamID64(),
          messages.INVITETOGROUP.ITSALREADY[
            users[sender.getSteamID64()].language
          ]
        );
      }
    } else {
      utils.chatMessage(
        client,
        sender.getSteamID64(),
        messages.INVITETOGROUP.ERROR[users[sender.getSteamID64()].language]
      );
      utils.error(`An error occurred inviting user to steam group: ${err}`);
    }
  });
};
