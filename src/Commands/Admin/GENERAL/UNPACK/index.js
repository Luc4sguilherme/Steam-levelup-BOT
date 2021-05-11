const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const utils = require('../../../../Utils');

module.exports = (sender, client, users, community, manager) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);

  log.adminChat(sender.getSteamID64(), language, '[ !UNPACK ]');
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
              log.error(
                `An error occurred while getting unpack Booster: ${ERR2}`
              );
            }
          });
        }
      }
      if (botBooster.length > 0) {
        chatMessage(
          client,
          sender,
          messages.UNPACK.RESPONSE[language].replace(
            '{BOOSTER}',
            botBooster.length
          )
        );
      } else {
        chatMessage(client, sender, messages.UNPACK.ERROR[language]);
      }
    } else {
      chatMessage(client, sender, messages.ERROR.LOADINVENTORY.US[language]);
      log.error(
        sender.getSteamID64(),
        `[ !UNPACK ] An error occurred while getting inventory: ${ERR1}`
      );
    }
  });
};
