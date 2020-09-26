const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');
const log = require('../../../../Components/log');

module.exports = (sender, client, users, community) => {
  chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  log.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !INVITE ]'
  );
  utils.checkUserinGroup(community, sender.getSteamID64(), (err, isMember) => {
    if (!err) {
      if (!isMember) {
        client.inviteToGroup(sender.getSteamID64(), main.groupID);
        chatMessage(
          client,
          sender.getSteamID64(),
          messages.INVITETOGROUP.INVITED[users[sender.getSteamID64()].language]
        );
      } else {
        chatMessage(
          client,
          sender.getSteamID64(),
          messages.INVITETOGROUP.ITSALREADY[
            users[sender.getSteamID64()].language
          ]
        );
      }
    } else {
      chatMessage(
        client,
        sender.getSteamID64(),
        messages.INVITETOGROUP.ERROR[users[sender.getSteamID64()].language]
      );
      log.error(`An error occurred inviting user to steam group: ${err}`);
    }
  });
};
