const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users) => {
  const n = parseInt(msg.toUpperCase().replace('!CHECKHYDRA ', ''), 10);
  if (!Number.isNaN(n) && parseInt(n, 10) > 0) {
    log.userChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !CHECKHYDRA ${n} ]`
    );
    if (main.maxCheck.hydra >= n) {
      utils.getBadges(
        sender.getSteamID64(),
        (ERR, DATA, CURRENTLEVEL, _, TOTALXP) => {
          if (!ERR) {
            if (DATA) {
              if (CURRENTLEVEL >= 0) {
                const xpWon = 100 * n * rates.hydra.sell;
                const totalExp = TOTALXP + xpWon;
                let i = parseInt(CURRENTLEVEL, 10) - 1;
                let can = 0;
                do {
                  i += 1;
                  if (i - 1 > main.maxLevel) {
                    chatMessage(
                      client,
                      sender,
                      messages.ERROR.INPUT.AMOUNTOVER.HYDRA[
                        users[sender.getSteamID64()].language
                      ].replace('{KEYS}', main.maxCheck.hydra)
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
                      messages.CHECK.HYDRA[0][
                        users[sender.getSteamID64()].language
                      ]
                        .replace(/{HYDRA}/g, n)
                        .replace('{SETS}', n * rates.hydra.sell)
                        .replace('{LEVEL}', i - 1)
                    );
                  } else {
                    chatMessage(
                      client,
                      sender,
                      messages.CHECK.HYDRA[1][
                        users[sender.getSteamID64()].language
                      ]
                        .replace(/{HYDRA}/g, n)
                        .replace('{SETS}', n * rates.hydra.sell)
                        .replace('{LEVEL}', i - 1)
                    );
                  }
                }
              } else {
                chatMessage(
                  client,
                  sender,
                  messages.ERROR.LEVEL[1][users[sender.getSteamID64()].language]
                );
              }
            } else {
              chatMessage(
                client,
                sender,
                messages.ERROR.LEVEL[0][users[sender.getSteamID64()].language]
              );
            }
          } else {
            log.error(`An error occurred while getting badge data: ${ERR}`);
            chatMessage(
              client,
              sender,
              messages.ERROR.BADGES[1][users[sender.getSteamID64()].language]
            );
          }
        }
      );
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.AMOUNTOVER.HYDRA[
          users[sender.getSteamID64()].language
        ].replace('{KEYS}', main.maxCheck.hydra)
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.HYDRA[
        users[sender.getSteamID64()].language
      ].replace('{command}', '!CHECKHYDRA 1')
    );
  }
};
