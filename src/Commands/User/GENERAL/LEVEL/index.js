const chatMessage = require('../../../../Components/message');
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils');
const log = require('../../../../Components/log');
const { filterCommands } = require('../../../../Utils');

module.exports = (sender, msg, client, users) => {
  const n = parseInt(msg.toUpperCase().replace('!LEVEL ', ''), 10);
  if (!Number.isNaN(n) && parseInt(n, 10) > 0) {
    log.userChat(
      sender.getSteamID64(),
      users[sender.getSteamID64()].language,
      `[ !LEVEL ${n} ]`
    );
    if (n <= main.maxLevel) {
      utils.getBadges(
        sender.getSteamID64(),
        (ERR, DATA, CURRENTLEVEL, CURRENTLEVELXP) => {
          if (!ERR) {
            if (DATA) {
              if (CURRENTLEVEL >= 0) {
                if (n > CURRENTLEVEL) {
                  let s = 0;
                  let l = 0;
                  for (let i = 0; i < n - CURRENTLEVEL; i += 1) {
                    s += parseInt((CURRENTLEVEL + l) / 10, 10) + 1;
                    l += 1;
                  }
                  const cs = Math.ceil(
                    parseInt(
                      ((s - Math.floor(CURRENTLEVELXP / 100)) /
                        rates.csgo.sell) *
                        100,
                      10
                    ) / 100
                  );
                  const hydra = Math.ceil(
                    parseInt(
                      ((s - Math.floor(CURRENTLEVELXP / 100)) /
                        rates.hydra.sell) *
                        100,
                      10
                    ) / 100
                  );
                  const tf = Math.ceil(
                    parseInt(
                      ((s - Math.floor(CURRENTLEVELXP / 100)) / rates.tf.sell) *
                        100,
                      10
                    ) / 100
                  );
                  const gems = parseInt(
                    (s - Math.floor(CURRENTLEVELXP / 100)) * rates.gems.sell,
                    10
                  );
                  chatMessage(
                    client,
                    sender,
                    filterCommands(
                      messages.LEVEL.RESPONSE[
                        users[sender.getSteamID64()].language
                      ]

                        .replace('{level}', n)
                        .replace(
                          '{sets1}',
                          s - Math.floor(CURRENTLEVELXP / 100)
                        )
                        .replace('{sets2}', cs * rates.csgo.sell)
                        .replace('{sets3}', hydra * rates.hydra.sell)
                        .replace('{sets4}', tf * rates.tf.sell)
                        .replace(
                          /{sets5}/g,
                          s - Math.floor(CURRENTLEVELXP / 100)
                        )
                        .replace(/{cs}/g, cs)
                        .replace(/{hydra}/g, hydra)
                        .replace(/{tf}/g, tf)
                        .replace('{gems}', gems)
                    ).join('\n')
                  );
                } else {
                  chatMessage(
                    client,
                    sender,
                    messages.ERROR.INPUT.AMOUNTLOW.LEVEL[
                      users[sender.getSteamID64()].language
                    ]
                  );
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
        messages.ERROR.INPUT.AMOUNTOVER.LEVEL[
          users[sender.getSteamID64()].language
        ]
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.LEVEL[users[sender.getSteamID64()].language]
    );
  }
};
