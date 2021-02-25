const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const { filterCommands } = require('../../../../Utils');

module.exports = (sender, msg, client, users) => {
  const m = msg.toUpperCase().replace('!CHECK ', '');
  const n = parseInt(m, 10);
  if (!Number.isNaN(n) && parseInt(n, 10) > 0) {
    if (main.maxCheck.csgo >= n) {
      log.userChat(
        sender.getSteamID64(),
        users[sender.getSteamID64()].language,
        `[ !CHECK ${n} ]`
      );

      chatMessage(
        client,
        sender,
        filterCommands(
          messages.CHECK.AMOUNT[users[sender.getSteamID64()].language]
            .replace(/{AMOUNT}/g, n)
            .replace('{CSGOSELL}', n * rates.csgo.sell)
            .replace('{TFSELL}', n * rates.tf.sell)
            .replace('{HYDRASELL}', n * rates.hydra.sell)
        ).join('\n')
      );
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.AMOUNTOVER.CSGO[
          users[sender.getSteamID64()].language
        ]
      );
    }
  } else if (m === '!CHECK') {
    if (Object.keys(inventory.botSets).length > 0) {
      log.userChat(
        sender.getSteamID64(),
        users[sender.getSteamID64()].language,
        '[ !CHECK ]'
      );
      chatMessage(
        client,
        sender,
        messages.REQUEST[users[sender.getSteamID64()].language]
      );
      utils.getBadges(
        sender.getSteamID64(),
        (ERR, DATA, CURRENTLEVEL, _, TOTALXP) => {
          if (!ERR) {
            const badges = {}; // List with badges that CAN still be crafted
            if (DATA) {
              for (let i = 0; i < Object.keys(DATA).length; i += 1) {
                if (DATA[Object.keys(DATA)[i]] < 6) {
                  badges[Object.keys(DATA)[i]] = 5 - DATA[Object.keys(DATA)[i]];
                }
              }
              let hisMaxSets = 0;

              // Loop for sets he has partially completed
              for (let i = 0; i < Object.keys(badges).length; i += 1) {
                if (
                  inventory.botSets[Object.keys(badges)[i]] &&
                  inventory.botSets[Object.keys(badges)[i]].length >=
                    badges[Object.keys(badges)[i]]
                ) {
                  hisMaxSets += badges[Object.keys(badges)[i]];
                }
              }
              // Loop for sets he has never crafted
              for (
                let i = 0;
                i < Object.keys(inventory.botSets).length;
                i += 1
              ) {
                if (
                  Object.keys(badges).indexOf(
                    Object.keys(inventory.botSets)[i]
                  ) < 0
                ) {
                  if (
                    inventory.botSets[Object.keys(inventory.botSets)[i]]
                      .length >= 5
                  ) {
                    hisMaxSets += 5;
                  } else {
                    hisMaxSets +=
                      inventory.botSets[Object.keys(inventory.botSets)[i]]
                        .length;
                  }
                }
              }
              if (hisMaxSets) {
                const cs = parseInt(hisMaxSets / rates.csgo.sell, 10);
                const hydra = parseInt(hisMaxSets / rates.hydra.sell, 10);
                const tf = parseInt(hisMaxSets / rates.tf.sell, 10);
                const gems = parseInt(hisMaxSets * rates.gems.sell, 10);

                let message = '';
                if (cs > 0) {
                  message += messages.CHECK.DEFAULT.CURRENCIES.CSGO[
                    users[sender.getSteamID64()].language
                  ]
                    .replace(/{CSGO}/g, cs)
                    .replace('{SETS1}', cs * rates.csgo.sell);
                }
                if (hydra > 0) {
                  message += messages.CHECK.DEFAULT.CURRENCIES.HYDRA[
                    users[sender.getSteamID64()].language
                  ]
                    .replace(/{HYDRA}/g, hydra)
                    .replace('{SETS2}', hydra * rates.hydra.sell);
                }
                if (tf > 0) {
                  message += messages.CHECK.DEFAULT.CURRENCIES.TF[
                    users[sender.getSteamID64()].language
                  ]
                    .replace(/{TF}/g, tf)
                    .replace('{SETS3}', tf * rates.tf.sell);
                }
                if (parseInt(hisMaxSets, 10) > 0) {
                  message += messages.CHECK.DEFAULT.CURRENCIES.GEMS[
                    users[sender.getSteamID64()].language
                  ]
                    .replace('{GEMS}', gems)
                    .replace('{SETS4}', hisMaxSets)
                    .replace('{SETS5}', parseInt(hisMaxSets, 10));
                }

                message = filterCommands(message).join('\n');

                if (!message.includes('•')) {
                  chatMessage(
                    client,
                    sender,
                    messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[3][
                      users[sender.getSteamID64()].language
                    ]
                  );
                  return;
                }

                if (CURRENTLEVEL >= 0) {
                  const xpWon = 100 * hisMaxSets;
                  const totalExp = TOTALXP + xpWon;
                  let i = parseInt(CURRENTLEVEL, 10) - 1;
                  do {
                    i += 1;
                  } while (utils.getLevelExp(i) <= totalExp);
                  if (CURRENTLEVEL !== i - 1) {
                    chatMessage(
                      client,
                      sender,
                      messages.CHECK.DEFAULT.RESPONSE[0][
                        users[sender.getSteamID64()].language
                      ]
                        .replace('{SETS}', hisMaxSets)
                        .replace('{LEVEL}', i - 1)
                        .replace('{MESSAGE}', message)
                    );
                  } else {
                    chatMessage(
                      client,
                      sender,
                      messages.CHECK.DEFAULT.RESPONSE[1][
                        users[sender.getSteamID64()].language
                      ]
                        .replace('{SETS}', hisMaxSets)
                        .replace('{LEVEL}', i - 1)
                        .replace('{MESSAGE}', message)
                    );
                  }
                } else {
                  chatMessage(
                    client,
                    sender,
                    messages.ERROR.LEVEL[1][
                      users[sender.getSteamID64()].language
                    ]
                  );
                }
              } else {
                chatMessage(
                  client,
                  sender,
                  messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[3][
                    users[sender.getSteamID64()].language
                  ]
                );
              }
            } else {
              chatMessage(
                client,
                sender,
                messages.ERROR.BADGES[0][users[sender.getSteamID64()].language]
              );
            }
          } else {
            chatMessage(
              client,
              sender,
              messages.ERROR.BADGES[1][users[sender.getSteamID64()].language]
            );
            log.error(`An error occurred while getting badges: ${ERR}`);
          }
        }
      );
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[2][
          users[sender.getSteamID64()].language
        ]
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.UNKNOW.CUSTOMER[
        users[sender.getSteamID64()].language
      ]
    );
  }
};
