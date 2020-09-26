const SteamTotp = require('steam-totp');
const messages = require('../../../../Config/messages');
const main = require('../../../../Config/main');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');

module.exports = (sender, client, users) => {
  log.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !AUTHCODE ]'
  );
  chatMessage(
    client,
    sender,
    messages.AUTHCODE[users[sender.getSteamID64()].language].replace(
      '{CODE}',
      SteamTotp.getAuthCode(main.sharedSecret)
    )
  );
};
