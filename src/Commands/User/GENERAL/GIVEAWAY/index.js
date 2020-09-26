const jsonfile = require('jsonfile');
const chatMessage = require('../../../../Components/message');

const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');

let giveawayJSON;

module.exports = (sender, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !GIVEAWAY ]'
  );
  giveawayJSON = jsonfile.readFileSync('./Data/Giveaway/giveaway.json');
  let myentries = 0;
  let message = '';
  if (giveawayJSON.active) {
    const { length } = Object.keys(giveawayJSON.entries);
    for (let i = 0; i < length; i += 1) {
      const j = Object.keys(giveawayJSON.entries)[i];
      if (j === sender.getSteamID64()) {
        myentries = giveawayJSON.entries[j];
        break;
      }
    }
    if (myentries > 0) {
      message += messages.GIVEAWAY.DEFAULT[0][
        users[sender.getSteamID64()].language
      ].replace('{MYENTRIES}', myentries);
    } else {
      message +=
        messages.GIVEAWAY.DEFAULT[1][users[sender.getSteamID64()].language];
    }
    message += messages.GIVEAWAY.DEFAULT[2][
      users[sender.getSteamID64()].language
    ]
      .replace('{PRICE}', giveawayJSON.prize)
      .replace('{DATE}', giveawayJSON.end);
    chatMessage(client, sender, message);
  } else {
    chatMessage(
      client,
      sender,
      messages.GIVEAWAY.NOTACTIVE[users[sender.getSteamID64()].language]
    );
  }
};