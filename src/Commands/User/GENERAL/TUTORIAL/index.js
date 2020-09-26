const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const log = require('../../../../Components/log');

module.exports = (sender, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !TUTORIAL ]'
  );
  chatMessage(client, sender, main.tutorial);
};
