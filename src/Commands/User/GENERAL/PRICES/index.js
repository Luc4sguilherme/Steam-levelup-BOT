const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils/utils');

module.exports = (sender, client, users) => {
  utils.userChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    '[ !PRICES ]'
  );
  utils.chatMessage(
    client,
    sender,
    messages.PRICES[users[sender.getSteamID64()].language]
      .replace('{CSGOSELL}', rates.csgo.sell)
      .replace('{TFSELL}', rates.tf.sell)
      .replace('{HYDRASELL}', rates.hydra.sell)
      .replace('{GEMSSELL}', rates.gems.sell)
      .replace('{CSGOBUY}', rates.csgo.buy)
      .replace('{TFBUY}', rates.tf.buy)
      .replace('{HYDRABUY}', rates.hydra.buy)
      .replace('{GEMSBUY}', rates.gems.buy)
  );
};
