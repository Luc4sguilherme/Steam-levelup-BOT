const main = require('../../../../Config/main');
const utils = require('../../../../Utils/utils');

module.exports = (sender, client, users) => {
  utils.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !OWNER ]'
  );
  utils.chatMessage(client, sender, main.owner);
};
