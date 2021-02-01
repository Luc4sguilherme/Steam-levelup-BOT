const utils = require('../../../../Utils/utils');
const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const Profit = require('../../../../Components/profit');

module.exports = async (sender, client, users) => {
  try {
    const profit = await Profit.read();

    log.adminChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      '[ !PROFIT ]'
    );
    let message = '/pre ';
    message += messages.PROFIT.RESPONSE[0][
      users[sender.getSteamID64()].language
    ].replace(
      '{MONTH}',
      utils.getMonth(
        new Date().getMonth(),
        users[sender.getSteamID64()].language
      )
    );
    message += messages.PROFIT.RESPONSE[1][
      users[sender.getSteamID64()].language
    ].replace('{AMOUNT}', profit.totaltrades);
    if (profit.status.sets !== 0) {
      message += messages.PROFIT.SETS[users[sender.getSteamID64()].language]
        .replace(
          '{STATUS}',
          profit.status.sets > 0
            ? messages.PROFIT.PROFITED[users[sender.getSteamID64()].language]
            : messages.PROFIT.LOST[users[sender.getSteamID64()].language]
        )
        .replace(
          '{AMOUNT}',
          (profit.status.sets > 0 ? '+' : '-') + Math.abs(profit.status.sets)
        );
    }
    if (profit.status.csgo !== 0) {
      message += messages.PROFIT.CSGO[users[sender.getSteamID64()].language]
        .replace(
          '{STATUS}',
          profit.status.csgo > 0
            ? messages.PROFIT.PROFITED[users[sender.getSteamID64()].language]
            : messages.PROFIT.LOST[users[sender.getSteamID64()].language]
        )
        .replace(
          '{AMOUNT}',
          (profit.status.csgo > 0 ? '+' : '-') + Math.abs(profit.status.csgo)
        );
    }
    if (profit.status.hydra !== 0) {
      message += messages.PROFIT.HYDRA[users[sender.getSteamID64()].language]
        .replace(
          '{STATUS}',
          profit.status.hydra > 0
            ? messages.PROFIT.PROFITED[users[sender.getSteamID64()].language]
            : messages.PROFIT.LOST[users[sender.getSteamID64()].language]
        )
        .replace(
          '{AMOUNT}',
          (profit.status.hydra > 0 ? '+' : '-') + Math.abs(profit.status.hydra)
        );
    }
    if (profit.status.tf !== 0) {
      message += messages.PROFIT.TF[users[sender.getSteamID64()].language]
        .replace(
          '{STATUS}',
          profit.status.tf > 0
            ? messages.PROFIT.PROFITED[users[sender.getSteamID64()].language]
            : messages.PROFIT.LOST[users[sender.getSteamID64()].language]
        )
        .replace(
          '{AMOUNT}',
          (profit.status.tf > 0 ? '+' : '-') + Math.abs(profit.status.tf)
        );
    }
    if (profit.status.gems !== 0) {
      message += messages.PROFIT.GEMS[users[sender.getSteamID64()].language]
        .replace(
          '{STATUS}',
          profit.status.gems > 0
            ? messages.PROFIT.PROFITED[users[sender.getSteamID64()].language]
            : messages.PROFIT.LOST[users[sender.getSteamID64()].language]
        )
        .replace(
          '{AMOUNT}',
          (profit.status.gems > 0 ? '+' : '-') + Math.abs(profit.status.gems)
        );
    }
    message += messages.PROFIT.RESPONSE[2][
      users[sender.getSteamID64()].language
    ]
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
    chatMessage(client, sender, message);
  } catch (error) {
    log.error(`An error occurred while getting profit.json: ${error}`);
  }
};
