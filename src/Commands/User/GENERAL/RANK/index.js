const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');
const rank = require('../../../../Components/rank');
const chatMessage = require('../../../../Components/message');

module.exports = (sender, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !RANK ]'
  );
  chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  (async function () {
    await rank.update(sender.getSteamID64());
    await rank.get(
      sender.getSteamID64(),
      (ERR, WORLDWIDEXP, REGIONXP, COUNTRYXP) => {
        if (ERR) {
          chatMessage(
            client,
            sender,
            messages.RANK.ERROR[users[sender.getSteamID64()].language]
          );
        } else {
          chatMessage(
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
