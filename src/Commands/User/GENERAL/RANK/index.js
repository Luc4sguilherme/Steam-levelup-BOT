const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');
const { rank } = require('../../../../Components/rank');
const chatMessage = require('../../../../Components/message');
const utils = require('../../../../Utils');

module.exports = async (sender, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);

  log.userChat(sender.getSteamID64(), language, '[ !RANK ]');
  chatMessage(client, sender, messages.REQUEST[language]);

  try {
    const { WORLDWIDEXP, REGIONXP, COUNTRYXP } = await rank(
      sender.getSteamID64()
    );
    chatMessage(
      client,
      sender,
      messages.RANK.RESPONSE[language]
        .replace('{WORLDWIDEXP}', WORLDWIDEXP)
        .replace('{REGIONXP}', REGIONXP)
        .replace('{COUNTRYXP}', COUNTRYXP)
    );
  } catch (error) {
    log.error(`An error occurred while getting the rank: ${error}`);
    chatMessage(client, sender, messages.RANK.ERROR[language]);
  }
};
