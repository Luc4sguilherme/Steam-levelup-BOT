const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');

// Relog automatic
function restart(client) {
  utils.warn('Restarting...');
  client.relog();
}

module.exports = (sender, client, users) => {
  utils.chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !RESTART ]'
  );
  utils.chatMessage(
    client,
    sender,
    messages.RESTART[users[sender.getSteamID64()].language]
  );
  restart(client);
};
