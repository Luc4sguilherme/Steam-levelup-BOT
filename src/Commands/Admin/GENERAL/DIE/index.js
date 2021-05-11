const kill = require('tree-kill');
const process = require('process');

const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);

  chatMessage(client, sender, messages.REQUEST[language]);
  log.adminChat(sender.getSteamID64(), language, '[ !DIE ]');
  kill(process.ppid);
};
