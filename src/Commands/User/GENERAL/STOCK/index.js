const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');
const inventory = require('../../../../Utils/inventory');

module.exports = (sender, client, users) => {
  utils.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !STOCK ]'
  );
  utils.chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  setTimeout(function () {
    utils.chatMessage(
      client,
      sender,
      messages.STOCK[users[sender.getSteamID64()].language]
        .replace('{TOTALBOTSETS}', inventory.stock.totalBotSets)
        .replace('{CSKEYSTRADABLE}', inventory.stock.csKeys.tradable)
        .replace('{HYDRAKEYSTRADABLE}', inventory.stock.hydraKeys.tradable)
        .replace('{TFKEYSTRADABLE}', inventory.stock.tfKeys.tradable)
        .replace(
          '{GEMSQUANTITYTRADABLE}',
          inventory.stock.gemsQuantity.tradable
        )
        .replace('{CSKEYSNOTRADABLE}', inventory.stock.csKeys.notradable)
        .replace('{HYDRAKEYSNOTRADABLE}', inventory.stock.hydraKeys.notradable)
        .replace('{TFKEYSNOTRADABLE}', inventory.stock.tfKeys.notradable)
        .replace(
          '{GEMSQUANTITYNOTRADABLE}',
          inventory.stock.gemsQuantity.notradable
        )
    );
  }, 1000);
};
