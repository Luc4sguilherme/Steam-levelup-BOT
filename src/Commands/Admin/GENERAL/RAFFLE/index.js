const jsonfile = require('jsonfile');
const fs = require('fs');

const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');

module.exports = (sender, client, users) => {
  log.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !RAFFLE ]'
  );
  const giveawayJSON = jsonfile.readFileSync('./Data/Giveaway/giveaway.json');
  if (giveawayJSON.active) {
    if (!giveawayJSON.winner) {
      if (Object.keys(giveawayJSON.entries).length > 0) {
        const obj1 = {};
        let c = 0;
        for (let i = 0; i < Object.keys(giveawayJSON.entries).length; i += 1) {
          const a = Object.values(giveawayJSON.entries)[i];
          const b = Object.keys(giveawayJSON.entries)[i];
          for (let j = 0; j < a; j += 1) {
            obj1[c] = b;
            c += 1;
          }
        }
        const random = Math.floor(Math.random() * Object.keys(obj1).length);
        const winner = obj1[random];
        log.adminChat(
          sender.getSteamID64(),
          users[sender.getSteamID64()].language,
          `[ !RAFFLE ] Winner is: ${winner}`
        );
        chatMessage(
          client,
          sender,
          messages.GIVEAWAY.RAFFLE[0][users[sender.getSteamID64()].language]
            .replace('{USERNAME}', client.users[winner].player_name)
            .replace('{ID64}', winner)
            .replace('{ENTRIES}', giveawayJSON.entries[`${winner}`])
            .replace('{WINNER}', winner)
        );
        giveawayJSON.winner = winner;
        giveawayJSON.active = false;
        fs.writeFile(
          './Data/Giveaway/giveaway.json',
          JSON.stringify(giveawayJSON, null, '\t'),
          function (err) {
            if (err) {
              log.error(
                `An error occurred while writing winner giveaway entry file: ${err}`
              );
            } else {
              log.adminChat(
                sender.getSteamID64(),
                users[sender.getSteamID64()].language,
                '[ !RAFFLE ] Winner giveaway added! '
              );
            }
          }
        );
      } else {
        chatMessage(
          client,
          sender,
          messages.GIVEAWAY.RAFFLE[1][users[sender.getSteamID64()].language]
        );
      }
    } else {
      chatMessage(
        client,
        sender,
        messages.GIVEAWAY.RAFFLE[2][users[sender.getSteamID64()].language]
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.GIVEAWAY.NOTACTIVE[users[sender.getSteamID64()].language]
    );
  }
};
