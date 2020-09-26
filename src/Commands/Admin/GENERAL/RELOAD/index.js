const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');
const inventory = require('../../../../Utils/inventory');

module.exports = (sender, client, users, community, allCards) => {
  const load = {
    0: 'GEMS',
    1: 'CSGO',
    2: 'TF2',
    3: 'SETS',
    4: 'HYDRA',
  };
  utils.chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !RELOAD ]'
  );
  inventory.loadInventory(
    client,
    community,
    allCards,
    load,
    utils.playLoading,
    () => {
      inventory.play(client);
      utils.chatMessage(
        client,
        sender,
        messages.RELOAD[users[sender.getSteamID64()].language]
      );
    }
  );
};
