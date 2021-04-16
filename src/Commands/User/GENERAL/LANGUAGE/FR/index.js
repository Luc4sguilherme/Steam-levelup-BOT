const fs = require('graceful-fs');
const chatMessage = require('../../../../../Components/message');
const log = require('../../../../../Components/log');
const utils = require('../../../../../Utils');

module.exports = (sender, client, users) => {
  const user = users;
  log.userChat(
    sender.getSteamID64(),
    utils.getLanguage(sender.getSteamID64(), user),
    '[ !FR ]'
  );
  user[sender.getSteamID64()].language = 'FR';
  fs.writeFile('./Data/User/Users.json', JSON.stringify(user), (ERR) => {
    if (ERR) {
      log.error(`An error occurred while writing UserData file: ${ERR}`);
    } else {
      chatMessage(client, sender, 'Langue changée en français');
    }
  });
};
