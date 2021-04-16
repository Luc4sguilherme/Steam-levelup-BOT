const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const { restart } = require('../../../../Components/login');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  chatMessage(
    client,
    sender,
    messages.REQUEST[utils.getLanguage(sender.getSteamID64(), users)]
  );
  log.adminChat(
    sender.getSteamID64(),
    utils.getLanguage(sender.getSteamID64(), users),
    '[ !RESTART ]'
  );
  chatMessage(
    client,
    sender,
    messages.RESTART[utils.getLanguage(sender.getSteamID64(), users)]
  );
  restart(client);
};
