const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');

module.exports = (sender, client, users) => {
  utils.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !RANK ]'
  );
  utils.chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  (async function () {
    await utils.updateRank(sender.getSteamID64());
    await utils.getRank(
      sender.getSteamID64(),
      (ERR, WORLDWIDEXP, REGIONXP, COUNTRYXP) => {
        if (ERR) {
          utils.chatMessage(
            client,
            sender,
            messages.RANK.ERROR[users[sender.getSteamID64()].language]
          );
        } else {
          utils.chatMessage(
            client,
            sender,
            messages.RANK.RESPONSE[users[sender.getSteamID64()].language]
              .replace('{WORLDWIDEXP}', WORLDWIDEXP)
              .replace('{REGIONXP}', REGIONXP)
              .replace('{COUNTRYXP}', COUNTRYXP)
          );
        }
      }
    );
  })();
};
