const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');
const { rank } = require('../../../../Components/rank');
const chatMessage = require('../../../../Components/message');

module.exports = async (sender, client, users) => {
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

  try {
    const { WORLDWIDEXP, REGIONXP, COUNTRYXP } = await rank(
      sender.getSteamID64()
    );
    chatMessage(
      client,
      sender,
      messages.RANK.RESPONSE[users[sender.getSteamID64()].language]
        .replace('{WORLDWIDEXP}', WORLDWIDEXP)
        .replace('{REGIONXP}', REGIONXP)
        .replace('{COUNTRYXP}', COUNTRYXP)
    );
  } catch (error) {
    log.error(`An error occurred while getting the rank: ${error}`);
    chatMessage(
      client,
      sender,
      messages.RANK.ERROR[users[sender.getSteamID64()].language]
    );
  }
};
