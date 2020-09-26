const utils = require('../../../../Utils/utils');

module.exports = (sender, msg, client, users) => {
  const n = msg.substring('!BROADCAST'.length).trim();
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    `[ !BROADCAST ${n} ]`
  );
  for (let i = 0; i <= Object.keys(client.myFriends).length; i += 1) {
    if (Object.values(client.myFriends)[i] === 3) {
      utils.chatMessage(client, Object.keys(client.myFriends)[i], `/pre ${n}`);
    }
  }
};
