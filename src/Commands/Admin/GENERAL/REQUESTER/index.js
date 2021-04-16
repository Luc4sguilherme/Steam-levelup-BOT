const messages = require('../../../../Config/messages');
const main = require('../../../../Config/main');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const request = require('../../../../Components/request');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, client, users, community, allCards, manager) => {
  log.adminChat(
    sender.getSteamID64(),
    utils.getLanguage(sender.getSteamID64(), users),
    '[ !REQUESTER ]'
  );
  chatMessage(
    client,
    sender,
    messages.REQUESTER[0][utils.getLanguage(sender.getSteamID64(), users)]
  );
  let i = 0;
  const ID64 = main.requester.steamID64;
  if (ID64[0]) {
    (function req() {
      if (i < ID64.length) {
        request(
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
    chatMessage(
      client,
      sender,
      messages.REQUESTER[1][utils.getLanguage(sender.getSteamID64(), users)]
    );
  }
};
