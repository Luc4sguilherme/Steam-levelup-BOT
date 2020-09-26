const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils/utils');

module.exports = (sender, msg, client, users) => {
  const n = parseInt(msg.toUpperCase().replace('!CHECKCSGO ', ''), 10);
  if (!Number.isNaN(n) && parseInt(n, 10) > 0) {
    utils.userChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !CHECKCSGO ${n} ]`
    );
    if (main.maxCheck.csgo >= n) {
      utils.getBadges(
        sender.getSteamID64(),
        (ERR, DATA, CURRENTLEVEL, XPNEEDED, TOTALXP) => {
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
                    utils.chatMessage(
                      client,
                      sender,
                      messages.ERROR.INPUT.AMOUNTOVER.CSGO[
                        users[sender.getSteamID64()].language
                      ]
                    );
                    can += 1;
                    break;
                  }
                } while (utils.getLevelExp(i) <= totalExp);
                if (!can) {
                  if (CURRENTLEVEL !== i - 1) {
                    utils.chatMessage(
                      client,
                      sender,
                      messages.CHECK.CSGO[0][
                        users[sender.getSteamID64()].language
                      ]
                        .replace(/{CSGO}/g, n)
                        .replace('{SETS}', n * rates.csgo.sell)
                        .replace('{LEVEL}', i - 1)
                    );
                  } else {
                    utils.chatMessage(
                      client,
                      sender,
                      messages.CHECK.CSGO[1][
                        users[sender.getSteamID64()].language
                      ]
                        .replace(/{CSGO}/g, n)
                        .replace('{SETS}', n * rates.csgo.sell)
                        .replace('{LEVEL}', i - 1)
                    );
                  }
                }
              } else {
                utils.chatMessage(
                  client,
                  sender,
                  messages.ERROR.LEVEL[1][users[sender.getSteamID64()].language]
                );
              }
            } else {
              utils.chatMessage(
                client,
                sender,
                messages.ERROR.LEVEL[0][users[sender.getSteamID64()].language]
              );
            }
          } else {
            utils.error(`An error occurred while getting badge data: ${ERR}`);
            utils.chatMessage(
              client,
              sender,
              messages.ERROR.BADGES[1][users[sender.getSteamID64()].language]
            );
          }
        }
      );
    } else {
      utils.chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.AMOUNTOVER.CSGO[
          users[sender.getSteamID64()].language
        ]
      );
    }
  } else {
    utils.chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.CSGO[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!CHECKCSGO 1')
    );
  }
};
