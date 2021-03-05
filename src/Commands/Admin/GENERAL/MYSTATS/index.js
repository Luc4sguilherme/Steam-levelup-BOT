const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const customer = require('../../../../Components/customer');

module.exports = (sender, client, users, community, allCards) => {
  chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );

  log.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    `[ !MYSTATS ]`
  );

  customer.loadInventory(sender.getSteamID64(), community, allCards, (err) => {
    if (err) {
      chatMessage(
        client,
        sender,
        messages.ERROR.LOADINVENTORY.THEM[0][
          users[sender.getSteamID64()].language
        ]
      );
    } else {
      const message = `/pre ${messages.ADMINCHECK.INVENTORY[
        users[sender.getSteamID64()].language
      ]
        .replace('{TOTALSETS}', customer.stock.totalSets)
        .replace('{CSKEYSTRADABLE}', customer.stock.csKeys.tradable)
        .replace('{HYDRAKEYSTRADABLE}', customer.stock.hydraKeys.tradable)
        .replace('{TFKEYSTRADABLE}', customer.stock.tfKeys.tradable)
        .replace('{GEMSQUANTITYTRADABLE}', customer.stock.gemsQuantity.tradable)
        .replace('{CSKEYSNOTRADABLE}', customer.stock.csKeys.notradable)
        .replace('{HYDRAKEYSNOTRADABLE}', customer.stock.hydraKeys.notradable)
        .replace('{TFKEYSNOTRADABLE}', customer.stock.tfKeys.notradable)
        .replace(
          '{GEMSQUANTITYNOTRADABLE}',
          customer.stock.gemsQuantity.notradable
        )}`;

      chatMessage(client, sender, message);
    }
  });
};
