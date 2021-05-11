const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const { restart } = require('../../../../Components/login');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);

  chatMessage(client, sender, messages.REQUEST[language]);
  log.adminChat(sender.getSteamID64(), language, '[ !RESTART ]');
  chatMessage(client, sender, messages.RESTART[language]);
  restart(client);
};
