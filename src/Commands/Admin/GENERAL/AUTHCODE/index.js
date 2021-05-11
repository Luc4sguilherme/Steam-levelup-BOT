const SteamTotp = require('steam-totp');
const messages = require('../../../../Config/messages');
const main = require('../../../../Config/main');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  log.adminChat(sender.getSteamID64(), language, '[ !AUTHCODE ]');
  chatMessage(
    client,
    sender,
    messages.AUTHCODE[language].replace(
      '{CODE}',
      SteamTotp.getAuthCode(main.sharedSecret)
    )
  );
};
