const chatMessage = require('../../../../Components/message');
const messages = require('../../../../Config/messages');
const log = require('../../../../Components/log');
const { removeKeys } = require('../../../../Utils');
const main = require('../../../../Config/main');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  log.userChat(sender.getSteamID64(), language, '[ !KEYLIST ]');
  let message = '';
  message += messages.KEYLIST.MESSAGES[0][language];

  if (main.acceptedCurrencies.CSGO || main.acceptedCurrencies.HYDRA) {
    message += messages.KEYLIST.MESSAGES[1][language];
    for (
      let i = 0;
      i < messages.KEYLIST.ACCEPTED.CSGO[language].length;
      i += 1
    ) {
      message += messages.KEYLIST.ACCEPTED.CSGO[language][i];
    }
  }

  message += messages.KEYLIST.MESSAGES[2][language];
  for (let j = 0; j < messages.KEYLIST.ACCEPTED.TF[language].length; j += 1) {
    message += messages.KEYLIST.ACCEPTED.TF[language][j];
  }

  message = `/pre ${removeKeys(message).join('\n')}`;

  chatMessage(client, sender, message);
};
