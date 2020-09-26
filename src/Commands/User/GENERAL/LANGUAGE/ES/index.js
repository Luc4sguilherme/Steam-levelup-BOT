const fs = require('fs');
const utils = require('../../../../../Utils/utils');

module.exports = (sender, client, users) => {
  const user = users;
  utils.userChat(
    sender.getSteamID64(),
    user[sender.getSteamID64()].language,
    '[ !ES ]'
  );
  user[sender.getSteamID64()].language = 'ES';
  fs.writeFile('./Data/User/Users.json', JSON.stringify(user), (ERR) => {
    if (ERR) {
      utils.error(`An error occurred while writing UserData file: ${ERR}`);
    } else {
      utils.chatMessage(client, sender, 'Idioma cambiado a español');
    }
  });
};
