const chatMessage = require('../../../../Components/message');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const log = require('../../../../Components/log');
const { filterCommands } = require('../../../../Utils');
const utils = require('../../../../Utils');

module.exports = (sender, client, users) => {
  log.userChat(
    sender.getSteamID64(),
    utils.getLanguage(sender.getSteamID64(), users),
    '[ !PRICES ]'
  );
  chatMessage(
    client,
    sender,
    filterCommands(
      messages.PRICES[utils.getLanguage(sender.getSteamID64(), users)]
    )
      .join('\n')
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
