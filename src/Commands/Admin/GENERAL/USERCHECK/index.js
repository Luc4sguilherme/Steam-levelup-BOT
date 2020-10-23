const SID64REGEX = new RegExp(/^[0-9]{17}$/);

const messages = require('../../../../Config/messages');
const acceptedKeys = require('../../../../Config/keys');
const utils = require('../../../../Utils/utils');
const inventory = require('../../../../Components/inventory');
const chatMessage = require('../../../../Components/message');
const { getSets } = require('../../../../Components/sets');
const log = require('../../../../Components/log');

module.exports = async (sender, msg, client, users, community, allCards) => {
  chatMessage(
    client,
    sender,
    messages.REQUEST[users[sender.getSteamID64()].language]
  );
  const n = msg.toUpperCase().replace('!USERCHECK ', '').toString();
  log.adminChat(
    sender.getSteamID64(),
    users[sender.getSteamID64()].language,
    `[ !USERCHECK ${n} ]`
  );
  if (SID64REGEX.test(n)) {
    let message = '/pre ';
    // check the relationship
    switch (client.myFriends[n]) {
      case 3:
        message +=
          messages.USERCHECK.RELATIONSHIP.FRIEND[
            users[sender.getSteamID64()].language
          ];
        break;
      case 5:
        message +=
          messages.USERCHECK.RELATIONSHIP.BANNED[
            users[sender.getSteamID64()].language
          ];
        break;
      default:
        message +=
          messages.USERCHECK.RELATIONSHIP.NOTAFRIEND[
            users[sender.getSteamID64()].language
          ];
    }

    try {
      const DATA = await utils.getRep(n);

      const u = JSON.parse(DATA);
      message +=
        messages.USERCHECK.REPUTATION.DEFAULT[
          users[sender.getSteamID64()].language
        ];
      switch (u.steamrep.reputation.summary) {
        case 'SCAMMER':
          message +=
            messages.USERCHECK.REPUTATION.SCAMMER[
              users[sender.getSteamID64()].language
            ];
          break;
        case 'Caution':
          message +=
            messages.USERCHECK.REPUTATION.CAUTION[
              users[sender.getSteamID64()].language
            ];
          break;
        case 'Admin':
          message +=
            messages.USERCHECK.REPUTATION.ADMIN[
              users[sender.getSteamID64()].language
            ];
          break;
        case 'Middleman':
          message +=
            messages.USERCHECK.REPUTATION.MIDDLEMAN[
              users[sender.getSteamID64()].language
            ];
          break;
        case 'Trusted Seller':
          message +=
            messages.USERCHECK.REPUTATION.TRUSTEDSELLER[
              users[sender.getSteamID64()].language
            ];
          break;
        case 'none':
          message +=
            messages.USERCHECK.REPUTATION.NONE[
              users[sender.getSteamID64()].language
            ];
          break;
        default:
          message +=
            messages.USERCHECK.REPUTATION.UNKNOWN[
              users[sender.getSteamID64()].language
            ];
      }
      if (u.steamrep.reputation.tags) {
        switch (u.steamrep.reputation.tags.tag.category) {
          case 'evil':
            message +=
              messages.USERCHECK.REPUTATION.EVIL[
                users[sender.getSteamID64()].language
              ];
            break;
          case 'trusted':
            message +=
              messages.USERCHECK.REPUTATION.TRUSTED[
                users[sender.getSteamID64()].language
              ];
            break;
          case 'misc':
            message +=
              messages.USERCHECK.REPUTATION.MISC[
                users[sender.getSteamID64()].language
              ];
            break;
          default:
            message +=
              messages.USERCHECK.REPUTATION.UNKNOWN[
                users[sender.getSteamID64()].language
              ];
        }
      }
      if (u.steamrep.vacban === 1) {
        message +=
          messages.USERCHECK.REPUTATION.VACBAN[
            users[sender.getSteamID64()].language
          ];
      }
      if (u.steamrep.tradeban === 2) {
        message +=
          messages.USERCHECK.REPUTATION.TRADEBAN[
            users[sender.getSteamID64()].language
          ];
      }
      message += '\n';
    } catch (error) {
      log.error(`An error occurred while getting user in Steamrep: ${error}`);
    }

    const customer = {
      totalSets: 0,
      CSkeys: {
        tradable: 0,
        notradable: 0,
      },
      TFkeys: {
        tradable: 0,
        notradable: 0,
      },
      HYDRAkeys: {
        tradable: 0,
        notradable: 0,
      },
      gemsQuantity: {
        tradable: 0,
        notradable: 0,
      },
      check: function (callback) {
        const timeStart = Date.now();
        community.getUserInventoryContents(n, 753, 6, false, (ERR, INV) => {
          if (!ERR) {
            for (let i = 0; i < INV.length; i += 1) {
              if (
                acceptedKeys.steamGems.indexOf(INV[i].market_hash_name) >= 0
              ) {
                if (INV[i].tradable) {
                  this.gemsQuantity.tradable += INV[i].amount;
                } else {
                  this.gemsQuantity.notradable += INV[i].amount;
                }
              }
            }
          } else {
            log.error(
              `An error occurred while getting user Gems inventory: ${ERR}`
            );
          }
        });
        community.getUserInventoryContents(n, 730, 2, false, (ERR, INV) => {
          if (!ERR) {
            for (let i = 0; i < INV.length; i += 1) {
              if (acceptedKeys.csgo.indexOf(INV[i].market_hash_name) >= 0) {
                if (INV[i].tradable) {
                  this.CSkeys.tradable += 1;
                } else {
                  this.CSkeys.notradable += 1;
                }
              }
            }
            for (let i = 0; i < INV.length; i += 1) {
              if (acceptedKeys.hydra.indexOf(INV[i].market_hash_name) >= 0) {
                if (INV[i].tradable) {
                  this.HYDRAkeys.tradable += 1;
                } else {
                  this.HYDRAkeys.notradable += 1;
                }
              }
            }
          } else {
            log.error(
              `An error occurred while getting user CSGO inventory: ${ERR}`
            );
          }
        });
        community.getUserInventoryContents(n, 440, 2, false, (ERR, INV) => {
          if (!ERR) {
            for (let i = 0; i < INV.length; i += 1) {
              if (acceptedKeys.tf.indexOf(INV[i].market_hash_name) >= 0) {
                if (INV[i].tradable) {
                  this.TFkeys.tradable += 1;
                } else {
                  this.TFkeys.notradable += 1;
                }
              }
            }
          } else {
            log.error(
              `An error occurred while getting user TF2 inventory: ${ERR}`
            );
          }
        });

        if (Object.keys(inventory.botSets).length > 0) {
          utils.getBadges(n, (ERR, DATA) => {
            if (!ERR) {
              const b = {}; // List with badges that CAN still be crafted
              if (DATA) {
                for (let i = 0; i < Object.keys(DATA).length; i += 1) {
                  if (DATA[Object.keys(DATA)[i]] < 6) {
                    b[Object.keys(DATA)[i]] = 5 - DATA[Object.keys(DATA)[i]];
                  }
                }
              }
              let hisMaxSets = 0;
              let botNSets = 0;
              // Loop for sets he has partially completed
              for (let i = 0; i < Object.keys(b).length; i += 1) {
                if (
                  inventory.botSets[Object.keys(b)[i]] &&
                  inventory.botSets[Object.keys(b)[i]].length >=
                    b[Object.keys(b)[i]]
                ) {
                  hisMaxSets += b[Object.keys(b)[i]];
                }
              }
              // Loop for sets he has never crafted
              for (
                let i = 0;
                i < Object.keys(inventory.botSets).length;
                i += 1
              ) {
                if (
                  Object.keys(b).indexOf(Object.keys(inventory.botSets)[i]) < 0
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
                botNSets +=
                  inventory.botSets[Object.keys(inventory.botSets)[i]].length;
              }
              message += messages.USERCHECK.SETSAVAILABLE[
                users[sender.getSteamID64()].language
              ]
                .replace('{SETS1}', hisMaxSets)
                .replace('{SETS2}', botNSets);
            } else {
              chatMessage(
                client,
                sender,
                messages.ERROR.BADGES[3][users[sender.getSteamID64()].language]
              );
              log.error(`An error occurred while getting badges: ${ERR}`);
            }
          });
        }
        const timeEnd = Date.now();
        const duration = timeEnd - timeStart;
        setTimeout(function () {
          // Get all CardSets
          inventory.getInventory(n, community, (ERR1, DATA) => {
            if (!ERR1) {
              const s = DATA;
              getSets(s, allCards, (ERR2, DDATA) => {
                if (!ERR2) {
                  let userNSets = 0;
                  for (let i = 0; i < Object.keys(DDATA).length; i += 1) {
                    userNSets += DDATA[Object.keys(DDATA)[i]].length;
                  }
                  customer.totalSets = userNSets;
                } else {
                  callback(ERR2);
                }
              });
              callback(null);
            } else {
              callback(ERR1);
            }
          });
        }, 10000 + duration);
      },
    };
    customer.check((ERR) => {
      if (!ERR) {
        setTimeout(function () {
          message += messages.USERCHECK.INVENTORY[
            users[sender.getSteamID64()].language
          ]
            .replace('{TOTALSETS}', customer.totalSets)
            .replace('{CSKEYSTRADABLE}', customer.CSkeys.tradable)
            .replace('{HYDRAKEYSTRADABLE}', customer.HYDRAkeys.tradable)
            .replace('{TFKEYSTRADABLE}', customer.TFkeys.tradable)
            .replace('{GEMSQUANTITYTRADABLE}', customer.gemsQuantity.tradable)
            .replace('{CSKEYSNOTRADABLE}', customer.CSkeys.notradable)
            .replace('{HYDRAKEYSNOTRADABLE}', customer.HYDRAkeys.notradable)
            .replace('{TFKEYSNOTRADABLE}', customer.TFkeys.notradable)
            .replace(
              '{GEMSQUANTITYNOTRADABLE}',
              customer.gemsQuantity.notradable
            );
          chatMessage(client, sender, message);
        }, 1000);
      } else {
        chatMessage(
          client,
          sender,
          messages.ERROR.LOADINVENTORY.THEM[1][
            users[sender.getSteamID64()].language
          ]
        );
        log.error(`An error occurred while getting user inventory: ${ERR}`);
      }
    });
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.STEAMID64[
        users[sender.getSteamID64()].language
      ]
    );
  }
};
