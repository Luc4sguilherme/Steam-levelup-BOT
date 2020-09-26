const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');
const main = require('../../../../Config/main');
const inventory = require('../../../../Utils/inventory');

module.exports = (sender, client, users, community, allCards, manager) => {
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !REQUESTER ]'
  );
  utils.chatMessage(
    client,
    sender,
    messages.REQUESTER[0][users[sender.getSteamID64()].language]
  );
  let i = 0;
  const ID64 = main.requester.steamID64;
  if (ID64[0]) {
    (function req() {
      if (i < ID64.length) {
        utils.request(
          ID64[i],
          community,
          allCards,
          manager,
          inventory,
          (callback) => {
            if (callback) {
              i += 1;
              setTimeout(req, 10000);
            }
          }
        );
      }
    })();
  } else {
    utils.chatMessage(
      client,
      sender,
      messages.REQUESTER[1][users[sender.getSteamID64()].language]
    );
  }
};
