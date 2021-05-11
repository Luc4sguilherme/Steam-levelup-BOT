const moment = require('moment');

const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const Profit = require('../../../../Components/profit');
const { filterCommands } = require('../../../../Utils');
const utils = require('../../../../Utils');

module.exports = async (sender, msg, client, users) => {
  const input = msg.substring('!PROFIT'.length).trim().toUpperCase();
  const language = utils.getLanguage(sender.getSteamID64(), users);

  const period = () => {
    switch (utils.getPeriod(input)) {
      case 'DAILY':
        return {
          path: `Daily/${moment().format('DD-MM-YYYY')}`,
          period: 'DAILY',
        };

      case 'MONTHLY':
        return {
          path: `Monthly/${moment().format('MM-YYYY')}`,
          period: 'MONTHLY',
        };

      case 'YEARLY':
        return {
          path: `Yearly/${moment().format('YYYY')}`,
          period: 'YEARLY',
        };

      default:
        return {
          path: `Monthly/${moment().format('MM-YYYY')}`,
          period: 'MONTHLY',
        };
    }
  };

  try {
    log.adminChat(sender.getSteamID64(), language, `[ !PROFIT ${input} ]`);
    chatMessage(client, sender, messages.REQUEST[language]);

    const profit = await Profit.read(period().path);
    let message = '/pre ';

    message += messages.PROFIT.RESPONSE[0][period().period][language];
    message += messages.PROFIT.RESPONSE[1][language].replace(
      '{AMOUNT}',
      profit.totaltrades
    );
    if (profit.status.sets > 0) {
      message += messages.PROFIT.SETS[language]
        .replace('{STATUS}', messages.PROFIT.PROFITED[language])
        .replace('{AMOUNT}', profit.status.sets);
    }
    if (profit.status.csgo > 0) {
      message += messages.PROFIT.CSGO[language]
        .replace('{STATUS}', messages.PROFIT.PROFITED[language])
        .replace('{AMOUNT}', profit.status.csgo);
    }
    if (profit.status.hydra > 0) {
      message += messages.PROFIT.HYDRA[language]
        .replace('{STATUS}', messages.PROFIT.PROFITED[language])
        .replace('{AMOUNT}', profit.status.hydra);
    }
    if (profit.status.tf > 0) {
      message += messages.PROFIT.TF[language]
        .replace('{STATUS}', messages.PROFIT.PROFITED[language])
        .replace('{AMOUNT}', profit.status.tf);
    }
    if (profit.status.gems > 0) {
      message += messages.PROFIT.GEMS[language]
        .replace('{STATUS}', messages.PROFIT.PROFITED[language])
        .replace('{AMOUNT}', profit.status.gems);
    }
    message += messages.PROFIT.RESPONSE[2][language]
      .replace('{SETS1}', profit.sell.csgo.sets)
      .replace('{SETS2}', profit.sell.hydra.sets)
      .replace('{SETS3}', profit.sell.gems.sets)
      .replace('{SETS4}', profit.sell.tf.sets)
      .replace('{SETS5}', profit.buy.csgo.sets)
      .replace('{SETS6}', profit.buy.hydra.sets)
      .replace('{SETS7}', profit.buy.tf.sets)
      .replace('{SETS8}', profit.buy.gems.sets)
      .replace('{CSGOSELL}', profit.sell.csgo.currency)
      .replace('{HYDRASELL}', profit.sell.hydra.currency)
      .replace('{TFSELL}', profit.sell.tf.currency)
      .replace('{GEMSSELL}', profit.sell.gems.currency)
      .replace('{CSGOBUY}', profit.buy.csgo.currency)
      .replace('{HYDRABUY}', profit.buy.hydra.currency)
      .replace('{TFBUY}', profit.buy.tf.currency)
      .replace('{GEMSBUY}', profit.buy.gems.currency);

    message = filterCommands(message).join('\n');

    chatMessage(client, sender, message);
  } catch (error) {
    log.error(`An error occurred while getting profit: ${error}`);
    chatMessage(client, sender, messages.PROFIT.ERROR[language]);
  }
};
