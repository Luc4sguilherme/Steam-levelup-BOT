const fs = require('fs');
const jsonfile = require('jsonfile');

const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');

let giveawayJSON;

module.exports = (sender, client, users) => {
  utils.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !ENTER ]'
  );
  giveawayJSON = jsonfile.readFileSync('./Data/Giveaway/giveaway.json');
  let myentries = 0;
  if (giveawayJSON.active) {
    const { length } = Object.keys(giveawayJSON.entries);
    for (let i = 0; i < length; i += 1) {
      const j = Object.keys(giveawayJSON.entries)[i];
      if (j === sender.getSteamID64()) {
        myentries = giveawayJSON.entries[j];
        break;
      }
    }
    if (myentries === 0) {
      giveawayJSON = jsonfile.readFileSync('./Data/Giveaway/giveaway.json');
      giveawayJSON.entries[sender.getSteamID64()] = 1;
      fs.writeFile(
        './Data/Giveaway/giveaway.json',
        JSON.stringify(giveawayJSON, null, '\t'),
        function (err) {
          if (err)
            return utils.error(
              `An error occurred while writing giveaway entry file: ${err}`
            );
          utils.userChat(
            sender.getSteamID64(),
            users[sender.getSteamID64()].language,
            '[ !ENTER ] Giveaway entry added! '
          );
        }
      );
      utils.chatMessage(
        client,
        sender,
        messages.GIVEAWAY.ENTER[0][users[sender.getSteamID64()].language]
          .replace('{PRICE}', giveawayJSON.prize)
          .replace('{DATE}', giveawayJSON.end)
      );
    } else {
      utils.chatMessage(
        client,
        sender,
        messages.GIVEAWAY.ENTER[1][users[sender.getSteamID64()].language]
      );
    }
  } else {
    utils.chatMessage(
      client,
      sender,
      messages.GIVEAWAY.NOTACTIVE[users[sender.getSteamID64()].language]
    );
  }
};
