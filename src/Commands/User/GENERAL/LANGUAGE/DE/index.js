const fs = require('fs');
const chatMessage = require('../../../../../Components/message');
const log = require('../../../../../Components/log');

module.exports = (sender, client, users) => {
  const user = users;
  log.userChat(
    sender.getSteamID64(),
    user[sender.getSteamID64()].language,
    '[ !DE ]'
  );
  user[sender.getSteamID64()].language = 'DE';
  fs.writeFile('./Data/User/Users.json', JSON.stringify(user), (ERR) => {
    if (ERR) {
      log.error(`An error occurred while writing UserData file: ${ERR}`);
    } else {
      chatMessage(client, sender, 'Sprache auf Deutsch geändert');
    }
  });
};
