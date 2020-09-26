const messages = require('../../../../Config/messages');
const utils = require('../../../../Utils/utils');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');

module.exports = (sender, client, users, community, allCards) => {
  const load = {
    0: 'GEMS',
    1: 'CSGO',
    2: 'TF2',
    3: 'SETS',
    4: 'HYDRA',
  };
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
  inventory.loadInventory(
    client,
    community,
    allCards,
    load,
    utils.playLoading,
    () => {
      inventory.play(client);
      chatMessage(
        client,
        sender,
        messages.RELOAD[users[sender.getSteamID64()].language]
      );
    }
  );
};
