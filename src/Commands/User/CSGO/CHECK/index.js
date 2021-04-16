const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users) => {
  const n = parseInt(msg.toUpperCase().replace('!CHECKCSGO ', ''), 10);
  if (!Number.isNaN(n) && parseInt(n, 10) > 0) {
    log.userChat(
      sender.getSteamID64(),
      utils.getLanguage(sender.getSteamID64(), users),
      `[ !CHECKCSGO ${n} ]`
    );
    if (main.maxCheck.csgo >= n) {
      utils.getBadges(
        sender.getSteamID64(),
        (ERR, DATA, CURRENTLEVEL, _, TOTALXP) => {
          if (!ERR) {
            if (DATA) {
              if (CURRENTLEVEL >= 0) {
                const xpWon = 100 * n * rates.csgo.sell;
                const totalExp = TOTALXP + xpWon;
                let i = parseInt(CURRENTLEVEL, 10) - 1;
                let can = 0;
                do {
                  i += 1;
                  if (i - 1 > main.maxLevel) {
                    chatMessage(
                      client,
                      sender,
                      messages.ERROR.INPUT.AMOUNTOVER.CSGO[
                        utils.getLanguage(sender.getSteamID64(), users)
                      ].replace('{KEYS}', main.maxCheck.csgo)
                    );
                    can += 1;
                    break;
                  }
                } while (utils.getLevelExp(i) <= totalExp);
                if (!can) {
                  if (CURRENTLEVEL !== i - 1) {
                    chatMessage(
                      client,
                      sender,
                      messages.CHECK.CSGO[0][
                        utils.getLanguage(sender.getSteamID64(), users)
                      ]
                        .replace(/{CSGO}/g, n)
                        .replace('{SETS}', n * rates.csgo.sell)
                        .replace('{LEVEL}', i - 1)
                    );
                  } else {
                    chatMessage(
                      client,
                      sender,
                      messages.CHECK.CSGO[1][
                        utils.getLanguage(sender.getSteamID64(), users)
                      ]
                        .replace(/{CSGO}/g, n)
                        .replace('{SETS}', n * rates.csgo.sell)
                        .replace('{LEVEL}', i - 1)
                    );
                  }
                }
              } else {
                chatMessage(
                  client,
                  sender,
                  messages.ERROR.LEVEL[1][
                    utils.getLanguage(sender.getSteamID64(), users)
                  ]
                );
              }
            } else {
              chatMessage(
                client,
                sender,
                messages.ERROR.LEVEL[0][
                  utils.getLanguage(sender.getSteamID64(), users)
                ]
              );
            }
          } else {
            log.error(`An error occurred while getting badge data: ${ERR}`);
            chatMessage(
              client,
              sender,
              messages.ERROR.BADGES[1][
                utils.getLanguage(sender.getSteamID64(), users)
              ]
            );
          }
        }
      );
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.AMOUNTOVER.CSGO[
          utils.getLanguage(sender.getSteamID64(), users)
        ].replace('{KEYS}', main.maxCheck.csgo)
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.CSGO[
        utils.getLanguage(sender.getSteamID64(), users)
      ].replace('{command}', '!CHECKCSGO 1')
    );
  }
};
