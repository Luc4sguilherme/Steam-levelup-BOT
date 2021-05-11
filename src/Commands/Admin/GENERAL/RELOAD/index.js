const messages = require('../../../../Config/messages');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const main = require('../../../../Config/main');
const utils = require('../../../../Utils');

module.exports = (sender, client, users, community, allCards) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);
  const load = ['SETS'];

  Object.keys(main.acceptedCurrencies).forEach((currency) => {
    if (main.acceptedCurrencies[currency]) {
      if (currency === 'HYDRA') {
        load.push(currency);
      } else {
        load.unshift(currency);
      }
    }
  });

  chatMessage(client, sender, messages.REQUEST[language]);
  log.adminChat(sender.getSteamID64(), language, '[ !RELOAD ]');
  inventory.loadInventory(client, community, allCards, load, () => {
    inventory.play(client);
    chatMessage(client, sender, messages.RELOAD[language]);
  });
};
