const SteamTotp = require('steam-totp');
const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamCommunity = require('steamcommunity');
const SteamUser = require('steam-user');
const fs = require('fs');

const utils = require('./Utils/utils');
const messages = require('./Config/messages.js');
const main = require('./Config/main.js');
const rates = require('./Config/rates.js');
const inventory = require('./Utils/inventory');
const commands = require('./Commands');

let load;
let allCards = {};
let users = {};
let userMsgs = {};

// Initialize SteamUser, TradeOfferManager and SteamCommunity
const client = new SteamUser();
const manager = new TradeOfferManager({
  steam: client,
  language: 'en',
  pollInterval: '10000',
  cancelTime: '7200000', // 2 hours in ms
});
const community = new SteamCommunity();

// Reading the Users.json File
if (!fs.existsSync('./Data/User/Users.json')) {
  fs.writeFile(
    './Data/User/Users.json',
    JSON.stringify(users),
    {
      flags: 'w',
    },
    (ERR) => {
      if (ERR) {
        utils.error(`An error occurred while writing UserData file: ${ERR}`);
      }
    }
  );
} else {
  fs.readFile('./Data/User/Users.json', (ERR, DATA) => {
    if (ERR) {
      utils.error(
        `An error occurred while getting UserData from Users.json : ${ERR}`
      );
    } else {
      users = JSON.parse(DATA);
    }
  });
}

// create the profit.json File of the current month
if (
  !fs.existsSync(
    `./Data/History/Profit/${`0${new Date().getMonth() + 1}`.slice(
      -2
    )}-${new Date().getFullYear()}.json`
  )
) {
  const profit = {
    totaltrades: 0,
    status: {
      sets: 0,
      csgo: 0,
      gems: 0,
      hydra: 0,
      tf: 0,
    },
    sell: {
      csgo: {
        sets: 0,
        currency: 0,
      },
      gems: {
        sets: 0,
        currency: 0,
      },
      hydra: {
        sets: 0,
        currency: 0,
      },
      tf: {
        sets: 0,
        currency: 0,
      },
    },
    buy: {
      csgo: {
        sets: 0,
        currency: 0,
      },
      gems: {
        sets: 0,
        currency: 0,
      },
      hydra: {
        sets: 0,
        currency: 0,
      },
      tf: {
        sets: 0,
        currency: 0,
      },
    },
  };
  fs.writeFile(
    `./Data/History/Profit/${`0${new Date().getMonth() + 1}`.slice(
      -2
    )}-${new Date().getFullYear()}.json`,
    JSON.stringify(profit),
    (ERR) => {
      if (ERR) {
        utils.error(`An error occurred while writing profit file: ${ERR}`);
      }
    }
  );
}

// Loading Card Data in Sets
utils.getCardsInSets((ERR, DATA) => {
  if (!ERR) {
    allCards = DATA;
    const datalength = DATA ? Object.keys(DATA).length : 0;
    utils.warn(`Card data loaded. [${datalength}]`);
  } else {
    utils.error(`An error occurred while getting cards: ${ERR}`);
  }
});

// Constantly checking for a too long inactivity of any user in our friendlist
setInterval(() => {
  const c = [];
  const a = [];
  for (let i = 0; i < Object.keys(client.myFriends).length; i += 1) {
    if (users.hasOwnProperty(Object.keys(client.myFriends)[i]) === false) {
      a.push(Object.keys(client.myFriends)[i]);
    }
  }
  if (a.length > 0) {
    function addUsers(obj, prop) {
      for (const p of prop) {
        (obj[p] = {}), (obj[p].idleforhours = 0), (obj[p].language = 'EN');
      }
    }
    addUsers(users, a);
  }
  for (let i = 0; i < Object.keys(users).length; i += 1) {
    if (
      client.myFriends[Object.keys(users)[i]] === undefined ||
      client.myFriends[Object.keys(users)[i]] === 5
    ) {
      c.push(Object.keys(users)[i]);
    }
    if (users[Object.keys(users)[i]].idleforhours >= main.maxDaysAdded * 24) {
      utils.chatMessage(
        client,
        Object.keys(users)[i],
        messages.INACTIVE[users[Object.keys(users)[i]].language]
      );
      client.removeFriend(Object.keys(users)[i]);
      c.push(Object.keys(users)[i]);
    } else {
      users[Object.keys(users)[i]].idleforhours += 1;
    }
  }
  if (c.length > 0) {
    function deleteUsers(obj, prop) {
      for (const p of prop) {
        p in obj && delete obj[p];
      }
    }
    deleteUsers(users, c);
  }
  fs.writeFile('./Data/User/Users.json', JSON.stringify(users), (ERR) => {
    if (ERR) {
      utils.error(`An error occurred while writing UserData file: ${ERR}`);
    }
  });
}, 1000 * 60 * 60);

// Constantly checking for abusive spam
setInterval(() => {
  for (let i = 0; i < Object.keys(userMsgs).length; i += 1) {
    if (userMsgs[Object.keys(userMsgs)[i]] === main.maxMsgPerSec) {
      utils.chatMessage(
        client,
        Object.keys(userMsgs)[i],
        messages.SPAM[0][users[Object.keys(userMsgs)[i]].language]
      );
    } else if (userMsgs[Object.keys(userMsgs)[i]] > main.maxMsgPerSec) {
      utils.chatMessage(
        client,
        Object.keys(userMsgs)[i],
        messages.SPAM[1][users[Object.keys(userMsgs)[i]].language]
      );
      client.removeFriend(Object.keys(userMsgs)[i]);
      for (let j = 0; j < main.admins.length; j += 1) {
        utils.chatMessage(
          client,
          main.admins[j],
          messages.SPAM[2][users[Object.keys(userMsgs)[i]].language].replace(
            '{STEAMID64}',
            Object.keys(userMsgs)[i]
          )
        );
      }
    }
  }
  userMsgs = {};
}, 1000);

// Account Credentials, has to be setup in the main.js
client.logOn({
  accountName: main.userName,
  password: main.passWord,
  twoFactorCode: SteamTotp.getAuthCode(main.sharedSecret),
  identity_secret: main.identitySecret,
  rememberPassword: true,
  shared_secret: main.sharedSecret,
});

// When the WebSession logs in, we will set the Profile to Online, otherwise the Bot would appear offline while being online in the WebSession
client.on('loggedOn', () => {
  client.getPersonas([client.steamID], () => {
    // utils.info("Name: " + personas[client.steamID].player_name + " (" + client.steamID + ")");
  });
  if (main.ratesInBotName.status) {
    function rate() {
      if (main.ratesInBotName.currency === 'CSGO') {
        return rates.csgo.sell;
      }
      if (main.ratesInBotName.currency === 'TF') {
        return rates.tf.sell;
      }
      if (main.ratesInBotName.currency === 'HYDRA') {
        return rates.hydra.sell;
      }
      if (main.ratesInBotName.currency === 'GEMS') {
        return rates.gems.sell;
      }
    }
    client.setPersona(
      SteamUser.EPersonaState.Online,
      `${main.botName} ${rate()}:1`
    );
  } else if (main.botName) {
    client.setPersona(SteamUser.EPersonaState.Online, main.botName);
  } else {
    client.setPersona(SteamUser.EPersonaState.Online);
  }
});

// Starting the WebSession and setting up the Cookies
client.on('webSession', (sessionID, cookies) => {
  // Starting the WebSession
  manager.setCookies(cookies, (ERR) => {
    if (ERR) {
      utils.error('An error occurred while setting cookies.');
    } else {
      utils.info('Websession created and cookies set.');
    }
  });
  // Add people that added the bot while it was online.
  for (let i = 0; i < Object.keys(client.myFriends).length; i += 1) {
    if (client.myFriends[Object.keys(client.myFriends)[i]] === 2) {
      client.addFriend(Object.keys(client.myFriends)[i]);
      users[Object.keys(client.myFriends)[i]] = {};
      users[Object.keys(client.myFriends)[i]].language = 'EN';
    }
  }
  // Refuse group invites
  if (main.refuseGroups) {
    for (let i = 0; i < Object.keys(client.myGroups).length; i += 1) {
      if (client.myGroups[Object.keys(client.myGroups)[i]] === 2) {
        client.respondToGroupInvite(Object.keys(client.myGroups)[i], false);
      }
    }
  }
  // Set Cookies and start the confirmation checker
  community.setCookies(cookies);
  community.startConfirmationChecker(10000, main.identitySecret);
  // Update stock
  load = {
    0: 'GEMS',
    1: 'CSGO',
    2: 'TF2',
    3: 'SETS',
    4: 'HYDRA',
  };
  inventory.loadInventory(
    client,
    community,
    allCards,
    load,
    utils.playLoading,
    () => {
      inventory.play(client);
    }
  );
  // Requester
  if (main.requester.enabled) {
    setInterval(() => {
      let i = 0;
      const ID64 = main.requester.steamID64;
      (function req() {
        if (i < ID64.length) {
          utils.request(
            ID64[i],
            community,
            allCards,
            manager,
            inventory,
            (callback) => {
              if (callback) {
                i += 1;
                setTimeout(req, 10000);
              }
            }
          );
        }
      })();
    }, 1000 * 60 * 60 * main.requester.interval);
  }
});

// Relog when the websession is expired
community.on('sessionExpired', () => {
  utils.info('Session Expired. Relogging.');
  client.webLogOn();
});

setInterval(function checkSteamLogged() {
  community.loggedIn(function (err, loggedIn) {
    if (err) {
      utils.warn('checkSteamLogged');
      if (
        err.message.indexOf('socket hang up') > -1 ||
        err.message.indexOf('ESOCKETTIMEDOUT') > -1
      ) {
        utils.restart();
      } else {
        setTimeout(checkSteamLogged, 1000 * 10);
      }
    } else if (!loggedIn) {
      utils.warn('WebLogin check : NOT LOGGED IN');
      utils.restart();
    } else {
      utils.warn('WebLogin check : LOGGED IN');
      client.setPersona(SteamUser.EPersonaState.LookingToTrade);
    }
  });
}, 1000 * 60 * 15);

// Console will show us how much new Items we have
client.on('newItems', function (count) {
  utils.info(`We have ${count} new Items in our Inventory`);
});

// Console will show the registred email from the Bot account
client.on('emailInfo', function (address) {
  utils.info(`E-Mail: ${address}`);
});

// Console will show our current account limitations (ex. when we would be tradebanned, or could not access the market due to steam restrictions)
client.on('accountLimitations', function (
  limited,
  communityBanned,
  locked,
  canInviteFriends
) {
  if (limited) {
    utils.info(
      'Account is limited. Cannot send friend invites, use the market, open group chat, or access the web API.'
    );
  }
  if (communityBanned) {
    utils.info('Account is banned from Steam Community');
  }
  if (locked) {
    utils.info(
      'Account is locked. We cannot trade/gift/purchase items, play on VAC servers, or access Steam Community.  Shutting down.'
    );
    process.exit(1);
  }
  if (!canInviteFriends) {
    utils.info('Account is unable to send friend requests.');
  }
});

// Console will show the current Wallet Balance of the Steam Account
client.on('wallet', function (hasWallet, currency, balance) {
  if (hasWallet) {
    utils.info(
      `Wallet: ${SteamUser.formatCurrency(
        balance,
        currency
      )} Steam Credit remaining`
    );
  } else {
    utils.info('We do not have a Steam wallet.');
  }
});

// Handle the messages we get via Steam Chat
client.on('friendMessage', (SENDER, MSG) => {
  // Writing the User Logs to File
  utils.userLogs(SENDER, MSG);

  if (Object.keys(users).indexOf(SENDER.getSteamID64()) < 0) {
    users[SENDER.getSteamID64()] = {};
    users[SENDER.getSteamID64()].language = 'EN';
    users[SENDER.getSteamID64()].idleforhours = 0;
    fs.writeFile('./Data/User/Users.json', JSON.stringify(users), (ERR) => {
      if (ERR) {
        utils.error(`An error occurred while writing UserData file: ${ERR}`);
      }
    });
  } else {
    users[SENDER.getSteamID64()].idleforhours = 0;
  }
  if (userMsgs[SENDER.getSteamID64()]) {
    userMsgs[SENDER.getSteamID64()] += 1;
  } else {
    userMsgs[SENDER.getSteamID64()] = 1;
  }

  // User Messages
  if (client.myFriends[SENDER.getSteamID64()] === 5) {
    utils.chatMessage(
      client,
      SENDER,
      'You have been banned from using our services'
    );
  } else if (client.myFriends[SENDER.getSteamID64()] === undefined) {
    utils.chatMessage(client, SENDER, 'You need to add me as a friend');
  } else if (MSG.indexOf('[/tradeoffer]') >= 0) {
    utils.chatMessage(
      client,
      SENDER,
      messages.REQUEST[users[SENDER.getSteamID64()].language]
    );
    // this fix an error when the bot receives a donation
  } else if (
    inventory.loading &&
    (MSG.toUpperCase().search(/BUY/) !== -1 ||
      MSG.toUpperCase().search(/SELL/) !== -1 ||
      MSG.toUpperCase().search(/SETS4SETS/) !== -1 ||
      MSG.toUpperCase().search(/STOCK/) !== -1 ||
      MSG.toUpperCase() === '!CHECK' ||
      MSG.toUpperCase() === '!CHECKONE' ||
      MSG.toUpperCase().search(/WITHDRAW/) !== -1 ||
      MSG.toUpperCase().search(/DEPOSIT/) !== -1 ||
      MSG.toUpperCase().search(/RESTOCK/) !== -1 ||
      MSG.toUpperCase().search(/RELOAD/) !== -1 ||
      MSG.toUpperCase().search(/UNPACK/) !== -1)
  ) {
    return utils.chatMessage(
      client,
      SENDER,
      messages.LOADING[users[SENDER.getSteamID64()].language]
    );
  } else {
    commands(SENDER, MSG, client, users, community, allCards, manager);
  }
});
// Handle the Invites we send or receive
client.on('friendRelationship', (SENDER, REL) => {
  // If we add a friend
  if (REL === 2) {
    client.addFriend(SENDER, (err, name) => {
      if (err) {
        utils.error(
          `Error trying to add ${SENDER.getSteamID64()}Reason:${err}`
        );
      } else if (name) {
        utils.info(`Succesfully added ${SENDER.getSteamID64()} to friendlist.`);
        if (Object.keys(users).indexOf(SENDER.getSteamID64()) < 0) {
          users[SENDER.getSteamID64()] = {};
          users[SENDER.getSteamID64()].language = 'EN';
          users[SENDER.getSteamID64()].idleforhours = 0;
        } else {
          users[SENDER.getSteamID64()].idleforhours = 0;
        }
      }
    });
  } else if (REL === 0) {
    utils.info(
      `User ID: ${SENDER.getSteamID64()} has deleted us from their friendlist.`
    );
  }
  // If the friend invite gets accepted
  if (REL === 3) {
    utils.inviteToGroup(client, community, SENDER.getSteamID64());
    utils.chatMessage(client, SENDER, messages.WELCOME.EN);
    utils.chatMessage(client, SENDER, messages.WELCOME.PT);
    utils.chatMessage(client, SENDER, messages.WELCOME.RU);
    utils.chatMessage(client, SENDER, messages.WELCOME.ES);
    utils.chatMessage(client, SENDER, messages.WELCOME.CN);
    utils.chatMessage(client, SENDER, main.tutorial);
  }
});
// If the offer changes the state (example: Offer is created (1), confirmed (2) and the status changes to accepted (3) or declined (4).)
manager.on('sentOfferChanged', (OFFER) => {
  if (OFFER.state === 2) {
    // utils.chatMessage(client, OFFER.partner, "Your trade has been confirmed! Click here to accept it: https://www.steamcommunity.com/tradeoffer/" + OFFER.id);
    utils.tradeoffer(
      `Tradeoffer has been confirmed and is awaiting confirmation from User. TradeID:${OFFER.id}`
    );
  } else if (OFFER.state === 3) {
    utils.tradeoffer(`Tradeoffer has been completed. TradeID:${OFFER.id}`);

    // Update stock
    inventory.updateStock(OFFER, client, community, allCards);

    // Invite steam group
    utils.inviteToGroup(client, community, OFFER.partner.getSteamID64());

    // Trades history
    utils.tradesHistory(OFFER);

    let message = '/pre ';
    if (main.admins.indexOf(OFFER.partner.getSteamID64()) === -1) {
      // Notify the administrator of the exchanges made
      utils.notifyAdmin(client, users, OFFER);

      // Calculate profit
      utils.calculateProfit(OFFER);

      // Add giveaway entry if user entered
      utils.addGiveawayEntry(OFFER, (ERR) => {
        if (ERR) {
          utils.error(
            `An error occurred while writing giveaway entry file: ${ERR}`
          );
        } else {
          message +=
            messages.GIVEAWAY.ENTER[2][
              users[OFFER.partner.getSteamID64()].language
            ];
          utils.warn('Giveaway entry added! ');
        }
      });

      // Access to sets4sets command
      utils.accesstosets4sets(OFFER, (ERR, numsets) => {
        if (ERR) {
          utils.error(`An error occurred while writing UserData file: ${ERR}`);
        } else if (numsets > 0) {
          message += messages.SETS4SETS.CANUSE[1][
            users[OFFER.partner.getSteamID64()].language
          ].replace('{SETS}', numsets);
        } else {
          message += `• ${
            messages.SETS4SETS.CANUSE[0][
              users[OFFER.partner.getSteamID64()].language
            ]
          }`;
        }
      });
    }
    community.getSteamUser(OFFER.partner, (ERR, USER) => {
      if (ERR) {
        utils.error(`An error occurred while getting user profile: ${ERR}`);
      } else {
        let canComment;
        const u = users[OFFER.partner.getSteamID64()];
        if (u.hasOwnProperty('comments')) {
          if (
            Math.floor(new Date(utils.timeZone()).getTime() - u.comments) >
            1000 * 60 * 60 * main.comment
          ) {
            canComment = 1;
          } else {
            canComment = 0;
          }
        } else {
          canComment = 1;
        }
        if (canComment && main.doComment) {
          USER.comment(
            messages.COMMENT[users[OFFER.partner.getSteamID64()].language],
            (ERR1) => {
              if (ERR1) {
                utils.error(
                  `An error occurred while commenting on user profile: ${ERR1}`
                );
              } else {
                users[OFFER.partner.getSteamID64()].comments = {};
                users[OFFER.partner.getSteamID64()].comments = new Date(
                  utils.timeZone()
                ).getTime();
                fs.writeFile(
                  './Data/User/Users.json',
                  JSON.stringify(users),
                  (ERR2) => {
                    if (ERR2) {
                      utils.error(
                        `An error occurred while writing UserData file: ${ERR2}`
                      );
                    }
                  }
                );
              }
            }
          );
        }
        if (message.length > 5) {
          utils.chatMessage(client, OFFER.partner.getSteamID64(), message);
        }
        utils.checkUserinGroup(
          community,
          OFFER.partner.getSteamID64(),
          (err, isMember) => {
            if (!err) {
              if (main.groupSteam && main.doGroupInvites && !isMember) {
                utils.chatMessage(
                  client,
                  OFFER.partner.getSteamID64(),
                  messages.TRADE.DONE[0][
                    users[OFFER.partner.getSteamID64()].language
                  ].replace('{GROUP}', main.groupSteam)
                );
              } else {
                utils.chatMessage(
                  client,
                  OFFER.partner.getSteamID64(),
                  messages.TRADE.DONE[1][
                    users[OFFER.partner.getSteamID64()].language
                  ]
                );
              }
            } else {
              utils.chatMessage(
                client,
                OFFER.partner.getSteamID64(),
                messages.TRADE.DONE[1][
                  users[OFFER.partner.getSteamID64()].language
                ]
              );
              utils.error(
                `An error occurred inviting user to steam group: ${err}`
              );
            }
          }
        );
      }
    });
  } else if (OFFER.state === 4) {
    utils.chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.COUNTEROFFER[
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    utils.tradeoffer(`Aborted because of counter offer. TradeID:${OFFER.id}`);
  } else if (OFFER.state === 5) {
    utils.chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.EXPIRED[0][
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    utils.tradeoffer(`Tradeoffer expired. TradeID:${OFFER.id}`);
  } else if (OFFER.state === 6) {
    utils.chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.EXPIRED[1][
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    utils.tradeoffer(
      `Tradeoffer canceled by Bot (expired). TradeID:${OFFER.id}`
    );
  } else if (OFFER.state === 7 || OFFER.state === 10) {
    utils.chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.DECLINED.THEM[
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    utils.tradeoffer(`Tradeoffer declined by User. TradeID:${OFFER.id}`);
  } else if (OFFER.state === 8) {
    utils.chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.DECLINED.US[1][
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    utils.tradeoffer(
      `Tradeoffer canceled by Bot (items unavailable). TradeID:${OFFER.id}`
    );
  } else if (OFFER.state === 11) {
    utils.chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.ESCROW[
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    utils.tradeoffer(
      `Tradeoffer aborted because user is in escrow and cant trade. TradeID:${OFFER.id}`
    );
  }
});
// If we get a new offer and no error we check the escrow, if we and our partner are able to trade and WE dont send any items to the user we have a donation and accept it.
manager.on('newOffer', (OFFER) => {
  if (
    main.admins.indexOf(OFFER.partner.getSteamID64()) >= 0 ||
    main.admins.indexOf(parseInt(OFFER.partner.getSteamID64(), 10)) >= 0
  ) {
    OFFER.getUserDetails((ERR1, ME, THEM) => {
      if (ERR1) {
        utils.error(`An error occurred while getting trade holds: ${ERR1}`);
        utils.chatMessage(
          client,
          OFFER.partner,
          messages.ERROR.TRADEHOLD[users[OFFER.partner.getSteamID64()].language]
        );
        OFFER.decline((ERR2) => {
          if (ERR2) {
            utils.error(`An error occurred while declining trade: ${ERR2}`);
          }
        });
      } else if (ME.escrowDays === 0 && THEM.escrowDays === 0) {
        OFFER.accept((ERR3) => {
          if (ERR3) {
            utils.error(`An error occurred while accepting trade: ${ERR3}`);
            OFFER.decline((ERR4) => {
              if (ERR4) {
                utils.error(`An error occurred while accepting trade: ${ERR4}`);
              }
            });
          } else {
            utils.chatMessage(
              client,
              OFFER.partner,
              messages.TRADE.ACCEPTED[
                users[OFFER.partner.getSteamID64()].language
              ]
            );
          }
        });
      } else {
        utils.chatMessage(
          client,
          OFFER.partner,
          messages.TRADEHOLD[users[OFFER.partner.getSteamID64()].language]
        );
        OFFER.decline((ERR5) => {
          if (ERR5) {
            utils.error(`An error occurred while declining trade: ${ERR5}`);
          }
        });
      }
    });
  } else if (OFFER.itemsToGive.length === 0) {
    if (main.acceptDonations) {
      OFFER.accept((ERR) => {
        utils.tradeoffer(
          `New Donation by user #${OFFER.partner.getSteamID64()}`
        );
        if (ERR) {
          utils.error(`An error occurred while accepting trade: ${ERR}`);
        } else {
          for (let j = 0; j < main.admins.length; j += 1) {
            utils.chatMessage(
              client,
              main.admins[j],
              messages.TRADE.NOTIFYADMIN.DONATION[
                users[OFFER.partner.getSteamID64()].language
              ].replace('{ID64}', OFFER.partner.getSteamID64())
            );
          }
          utils.chatMessage(
            client,
            OFFER.partner,
            messages.TRADE.DONATION.ACCEPTED[
              users[OFFER.partner.getSteamID64()].language
            ]
          );
        }
      });
    } else {
      OFFER.decline((ERR) => {
        if (ERR) {
          utils.error(`An error occurred while declining trade: ${ERR}`);
        }
      });
      utils.chatMessage(
        client,
        OFFER.partner,
        messages.TRADE.DONATION.DECLINED[
          users[OFFER.partner.getSteamID64()].language
        ]
      );
    }
  } else {
    OFFER.decline((ERR) => {
      if (ERR) {
        utils.error(`An error occurred while declining trade: ${ERR}`);
      }
      utils.chatMessage(
        client,
        OFFER.partner,
        messages.TRADE.DECLINED.US[0][
          users[OFFER.partner.getSteamID64()].language
        ]
      );
    });
  }
});
// If we get a new confirmation then confirm the Trade
community.on('newConfirmation', (CONF) => {
  utils.tradeoffer('New confirmation.');
  community.acceptConfirmationForObject(main.identitySecret, CONF.id, (ERR) => {
    if (ERR) {
      utils.error(`An error occurred while accepting confirmation: ${ERR}`);
    } else {
      utils.tradeoffer('Confirmation accepted.');
    }
  });
});
