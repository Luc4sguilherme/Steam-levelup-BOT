/* eslint-disable no-restricted-syntax */
const main = require('../../../../Config/main');
const messages = require('../../../../Config/messages');
const rates = require('../../../../Config/rates');
const utils = require('../../../../Utils/utils');
const acceptedKeys = require('../../../../Config/keys');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const makeOffer = require('../../../../Components/offer');
const log = require('../../../../Components/log');

module.exports = (sender, msg, client, users, manager) => {
  if (inventory.botSets) {
    let n = msg.toUpperCase().replace('!BUYANYTF ', '');
    const amountofsets = parseInt(n, 10) * rates.tf.sell;
    const maxKeys = parseInt(main.maxBuy / rates.tf.sell, 10);
    if (!Number.isNaN(n) && parseInt(n, 10) > 0) {
      log.userChat(
        sender.getSteamID64(),
        users[sender.getSteamID64()].language,
        `[ !BUYANYTF ${n} ]`
      );
      if (n <= maxKeys) {
        n = parseInt(n, 10);
        const theirKeys = [];
        const mySets = [];
        chatMessage(
          client,
          sender,
          messages.REQUEST[users[sender.getSteamID64()].language]
        );
        manager.getUserInventoryContents(
          sender.getSteamID64(),
          440,
          2,
          true,
          (ERR, INV) => {
            if (!ERR) {
              let amountofB = amountofsets;
              for (let i = 0; i < INV.length; i += 1) {
                if (
                  theirKeys.length < n &&
                  acceptedKeys.tf.indexOf(INV[i].market_hash_name) >= 0
                ) {
                  theirKeys.push(INV[i]);
                }
              }
              if (theirKeys.length !== n) {
                chatMessage(
                  client,
                  sender,
                  messages.ERROR.OUTOFSTOCK.DEFAULT.TF.THEM[0][
                    users[sender.getSteamID64()].language
                  ]
                );
              } else {
                utils.sortSetsByAmount(inventory.botSets, (DATA) => {
                  const setsSent = {};
                  firstLoop: for (let i = 0; i < DATA.length; i += 1) {
                    if (inventory.botSets[DATA[i]]) {
                      for (
                        let j = 0;
                        j < inventory.botSets[DATA[i]].length;
                        j += 1
                      ) {
                        if (amountofB > 0) {
                          if (
                            (setsSent[DATA[i]] && setsSent[DATA[i]] > -1) ||
                            !setsSent[DATA[i]]
                          ) {
                            mySets.push(inventory.botSets[DATA[i]][j]);
                            amountofB -= 1;
                            if (!setsSent[DATA[i]]) {
                              setsSent[DATA[i]] = 1;
                            } else {
                              setsSent[DATA[i]] += 1;
                            }
                          } else {
                            continue firstLoop;
                          }
                        } else {
                          continue firstLoop;
                        }
                      }
                    } else {
                      continue;
                    }
                  }
                });
                if (amountofB > 0) {
                  chatMessage(
                    client,
                    sender,
                    messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[0][
                      users[sender.getSteamID64()].language
                    ]
                  );
                } else {
                  const message = messages.TRADE.SETMESSAGE[1].TF[
                    users[sender.getSteamID64()].language
                  ]
                    .replace('{SETS}', amountofsets)
                    .replace('{TF}', n);
                  makeOffer(
                    client,
                    users,
                    manager,
                    sender.getSteamID64(),
                    [].concat(...mySets),
                    theirKeys,
                    '!BUYANYTF',
                    message,
                    amountofsets,
                    0,
                    n,
                    0
                  );
                }
              }
            } else if (ERR.message.indexOf('profile is private') > -1) {
              chatMessage(
                client,
                sender,
                messages.ERROR.LOADINVENTORY.THEM[2][
                  users[sender.getSteamID64()].language
                ]
              );
              log.error(
                `An error occurred while getting user inventory: ${ERR}`
              );
            } else {
              chatMessage(
                client,
                sender,
                messages.ERROR.LOADINVENTORY.THEM[0][
                  users[sender.getSteamID64()].language
                ]
              );
              log.error(
                `An error occurred while getting user inventory: ${ERR}`
              );
            }
          }
        );
      } else {
        chatMessage(
          client,
          sender,
          messages.ERROR.INPUT.AMOUNTOVER.TF[
            users[sender.getSteamID64()].language
          ]
        );
      }
    } else {
      chatMessage(
        client,
        sender,
        messages.ERROR.INPUT.INVALID.TF[
          users[sender.getSteamID64()].language
        ].replace('{command}', '!BUYANYTF 1')
      );
    }
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.OUTOFSTOCK.DEFAULT.SETS.US[2][
        users[sender.getSteamID64()].language
      ]
    );
  }
};
