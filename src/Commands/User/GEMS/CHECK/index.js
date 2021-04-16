const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users) => {
  const n = parseInt(msg.toUpperCase().replace('!CHECKGEMS ', ''), 10);
  if (!Number.isNaN(n) && parseInt(n, 10) > 0) {
    if (n >= rates.gems.sell) {
      log.userChat(
        sender.getSteamID64(),
        utils.getLanguage(sender.getSteamID64(), users),
        `[ !CHECKGEMS ${n} ]`
      );
      if (main.maxCheck.gems >= n) {
        utils.getBadges(
          sender.getSteamID64(),
          (ERR, DATA, CURRENTLEVEL, CURRENTLEVELXP, TOTALXP) => {
            if (!ERR) {
              if (DATA) {
                if (CURRENTLEVEL >= 0) {
                  const c = utils.getLevelExp(CURRENTLEVEL + 1);
                  const d = (c - TOTALXP) / 100;
                  const xpWon = (100 * n) / rates.gems.sell;
                  const totalExp = TOTALXP + xpWon;
                  let i = parseInt(CURRENTLEVEL, 10) - 1;
                  let can = 0;
                  do {
                    i += 1;
                    if (i - 1 > main.maxLevel) {
                      chatMessage(
                        client,
                        sender,
                        messages.ERROR.INPUT.AMOUNTOVER.GEMS[
                          utils.getLanguage(sender.getSteamID64(), users)
                        ].replace('{GEMS}', main.maxCheck.gems)
                      );
                      can += 1;
                      break;
                    }
                  } while (utils.getLevelExp(i) <= totalExp);
                  if (!can) {
                    const a = parseInt(n / rates.gems.sell, 10);
                    let b;
                    if (
                      CURRENTLEVEL === 0 ||
                      CURRENTLEVELXP === 0 ||
                      d > n / rates.gems.sell ||
                      d <= parseInt(n / rates.gems.sell, 10)
                    ) {
                      b = i - 1;
                    } else {
                      b = i - 2;
                    }
                    if (CURRENTLEVEL !== b) {
                      chatMessage(
                        client,
                        sender,
                        messages.CHECK.GEMS[0][
                          utils.getLanguage(sender.getSteamID64(), users)
                        ]
                          .replace('{GEMS}', n)
                          .replace(/{SETS}/g, a)
                          .replace('{LEVEL}', b)
                      );
                    } else {
                      chatMessage(
                        client,
                        sender,
                        messages.CHECK.GEMS[1][
                          utils.getLanguage(sender.getSteamID64(), users)
                        ]
                          .replace('{GEMS}', n)
                          .replace(/{SETS}/g, a)
                          .replace('{LEVEL}', b)
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
          messages.ERROR.INPUT.AMOUNTOVER.GEMS[
            utils.getLanguage(sender.getSteamID64(), users)
          ].replace('{GEMS}', main.maxCheck.gems)
        );
      }
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.AMOUNTLOW.GEMS[
          utils.getLanguage(sender.getSteamID64(), users)
        ]
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.GEMS[
        utils.getLanguage(sender.getSteamID64(), users)
      ].replace('{command}', `!CHECKGEMS ${rates.gems.sell}`)
    );
  }
};
