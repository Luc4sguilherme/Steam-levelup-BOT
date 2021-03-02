const messages = require('../../../../Config/messages');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const main = require('../../../../Config/main');

module.exports = (sender, client, users, community, allCards) => {
  const load = ['SETS'];

  Object.keys(main.acceptedCurrency).forEach((currency) => {
    if (main.acceptedCurrency[currency]) {
      if (currency === 'HYDRA') {
        load.push(currency);
      } else {
        load.unshift(currency);
      }
    }
  });

  chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  log.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !RELOAD ]'
  );
  inventory.loadInventory(client, community, allCards, load, () => {
    inventory.play(client);
    chatMessage(
      client,
      sender,
      messages.RELOAD[users[sender.getSteamID64()].language]
    );
  });
};
