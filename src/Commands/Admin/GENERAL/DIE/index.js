const kill = require('tree-kill');
const process = require('process');

const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');

module.exports = (sender, client, users) => {
  utils.chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !DIE ]'
  );
  kill(process.ppid);
};
