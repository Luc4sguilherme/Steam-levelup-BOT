const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');

module.exports = (sender, client, users, community, manager) => {
  utils.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !UNPACK ]'
  );
  manager.getInventoryContents(753, 6, true, (ERR1, INV) => {
    if (!ERR1) {
      const botBooster = [];
      let itemid;
      let appid;
      for (let i = 0; i < INV.length; i += 1) {
        if (INV[i].type === 'Booster Pack') {
          botBooster.push(INV[i]);
          appid = INV[i].market_fee_app;
          itemid = INV[i].id;
          community.openBoosterPack(appid, itemid, (ERR2) => {
            if (ERR2) {
              utils.error(
                `An error occurred while getting unpack Booster: ${ERR2}`
              );
            }
          });
        }
      }
      if (botBooster.length > 0) {
        utils.chatMessage(
          client,
          sender,
          messages.UNPACK.RESPONSE[
            users[sender.getSteamID64()].language
          ].replace('{BOOSTER}', botBooster.length)
        );
      } else {
        utils.chatMessage(
          client,
          sender,
          messages.UNPACK.ERROR[users[sender.getSteamID64()].language]
        );
      }
    } else {
      utils.chatMessage(
        client,
        sender,
        messages.ERROR.LOADINVENTORY.US[users[sender.getSteamID64()].language]
      );
      utils.error(
        sender.getSteamID64(),
        `[ !UNPACK ] An error occurred while getting inventory: ${ERR1}`
      );
    }
  });
};
