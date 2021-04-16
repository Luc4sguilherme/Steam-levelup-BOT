const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    utils.getLanguage(sender.getSteamID64(), users),
    '[ !OWNER ]'
  );
  chatMessage(client, sender, main.owner);
};
