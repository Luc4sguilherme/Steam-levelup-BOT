const SteamTotp = require('steam-totp');
const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');
const main = require('../../../../Config/main');

module.exports = (sender, client, users) => {
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !AUTHCODE ]'
  );
  utils.chatMessage(
    client,
    sender,
    messages.AUTHCODE[users[sender.getSteamID64()].language].replace(
      '{CODE}',
      SteamTotp.getAuthCode(main.sharedSecret)
    )
  );
};
