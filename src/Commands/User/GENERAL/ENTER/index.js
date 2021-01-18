const fs = require('fs');
const chatMessage = require('../../../../Components/message');

const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');

module.exports = (sender, client, users) => {
  try {
    log.userChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      '[ !ENTER ]'
    );
    const giveawayJSON = JSON.parse(
      fs.readFileSync('./Data/Giveaway/giveaway.json')
    );
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
        giveawayJSON.entries[sender.getSteamID64()] = 1;
        fs.writeFile(
          './Data/Giveaway/giveaway.json',
          JSON.stringify(giveawayJSON, null, '\t'),
          (err) => {
            if (err)
              log.error(
                `An error occurred while writing giveaway entry file: ${err}`
              );
            log.warn('Giveaway entry added!');
          }
        );
        chatMessage(
          client,
          sender,
          messages.GIVEAWAY.ENTER[0][users[sender.getSteamID64()].language]
            .replace('{PRICE}', giveawayJSON.prize)
            .replace('{DATE}', giveawayJSON.end)
        );
      } else {
        chatMessage(
          client,
          sender,
          messages.GIVEAWAY.ENTER[1][users[sender.getSteamID64()].language]
        );
      }
    } else {
      chatMessage(
        client,
        sender,
        messages.GIVEAWAY.NOTACTIVE[users[sender.getSteamID64()].language]
      );
    }
  } catch (error) {
    log.error(`An error occurred while getting giveaway entry file: ${error}`);
  }
};
