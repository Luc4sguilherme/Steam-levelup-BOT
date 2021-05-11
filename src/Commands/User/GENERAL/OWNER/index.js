const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  log.userChat(sender.getSteamID64(), language, '[ !OWNER ]');
  chatMessage(client, sender, main.owner);
};
