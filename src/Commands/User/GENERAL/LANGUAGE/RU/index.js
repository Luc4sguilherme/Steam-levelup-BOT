const fs = require('fs');
const utils = require('../../../../../Utils/utils');

module.exports = (sender, client, users) => {
  const user = users;
  utils.userChat(
    sender.getSteamID64(),
    user[sender.getSteamID64()].language,
    '[ !RU ]'
  );
  user[sender.getSteamID64()].language = 'RU';
  fs.writeFile('./Data/User/Users.json', JSON.stringify(user), (ERR) => {
    if (ERR) {
      utils.error(`An error occurred while writing UserData file: ${ERR}`);
    } else {
      utils.chatMessage(client, sender, 'Язык изменен на русский.');
    }
  });
};
