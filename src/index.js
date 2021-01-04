const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamCommunity = require('steamcommunity');
const SteamUser = require('steam-user');
const fs = require('fs');

const utils = require('./Utils/utils');
const messages = require('./Config/messages.js');
const main = require('./Config/main.js');
const rates = require('./Config/rates.js');
const inventory = require('./Components/inventory');
const profit = require('./Components/profit');
const log = require('./Components/log');
const user = require('./Components/user');
const chatMessage = require('./Components/message');
const commands = require('./Commands');
const request = require('./Components/request');
const { getCardsInSets } = require('./Components/sets');
const login = require('./Components/login');

let allCards = {};
let userMsgs = {};
const timeouts = {};

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
const users = user.read();

// create the profit.json File of the current month
profit.init();

// Loading Card Data in Sets
getCardsInSets((ERR, DATA) => {
  if (!ERR) {
    allCards = DATA;
    const datalength = DATA ? Object.keys(DATA).length : 0;
    log.warn(`Card data loaded. [${datalength}]`);
  } else {
    log.error(`An error occurred while getting cards: ${ERR}`);
  }
});

// Constantly checking for a too long inactivity of any user in our friendlist
user.inactive(client, users);

// Constantly checking for abusive spam
setInterval(() => {
  userMsgs = user.spam(client, users, userMsgs);
}, 1000);

// Account Credentials, has to be setup in the main.js
login.init(client);

// When the WebSession logs in, we will set the Profile to Online, otherwise the Bot would appear offline while being online in the WebSession
client.on('loggedOn', () => {
  client.getPersonas([client.steamID], () => {
    // log.info("Name: " + personas[client.steamID].player_name + " (" + client.steamID + ")");
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
client.on('webSession', (_, cookies) => {
  // Starting the WebSession
  manager.setCookies(cookies, (ERR) => {
    if (ERR) {
      log.error('An error occurred while setting cookies.');
    } else {
      log.info('Websession created and cookies set.');
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
  if (main.steamGroup.refuseInvites) {
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
  inventory.loadInventory(
    client,
    community,
    allCards,
    {
      0: 'GEMS',
      1: 'CSGO',
      2: 'TF2',
      3: 'SETS',
      4: 'HYDRA',
    },
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
          request(
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

// Console will show us login session error
client.on('error', (error) => {
  switch (error.eresult) {
    case SteamUser.EResult.AccountDisabled:
      log.error(`This account is disabled!`);
      break;
    case SteamUser.EResult.InvalidPassword:
      log.error(`Invalid Password detected!`);
      break;
    case SteamUser.EResult.RateLimitExceeded:
      log.warn(`Rate Limit Exceeded, trying to login again in 5 minutes.`);
      clearTimeout(timeouts.login_timeout);
      timeouts.login_timeout = setTimeout(function () {
        login.restart(client);
      }, 1000 * 60 * 5);
      break;
    case SteamUser.EResult.LogonSessionReplaced:
      log.warn(
        `Unexpected Disconnection!, you have LoggedIn with this same account in another place..`
      );
      clearTimeout(timeouts.login_timeout);
      timeouts.login_timeout = setTimeout(function () {
        login.restart(client);
      }, 5000);
      break;
    default:
      log.warn('Unexpected Disconnection!');
      clearTimeout(timeouts.login_Unexpected);
      timeouts.login_Unexpected = setTimeout(function () {
        login.restart(client);
      }, 5000);
      break;
  }
});

// Constantly checking if you are logged in
login.check(client, community);

// Console will show us how much new Items we have
client.on('newItems', function (count) {
  log.info(`We have ${count} new Items in our Inventory`);
});

// Console will show the registred email from the Bot account
client.on('emailInfo', function (address) {
  log.info(`E-Mail: ${address}`);
});

// Console will show our current account limitations (ex. when we would be tradebanned, or could not access the market due to steam restrictions)
client.on('accountLimitations', function (
  limited,
  communityBanned,
  locked,
  canInviteFriends
) {
  if (limited) {
    log.info(
      'Account is limited. Cannot send friend invites, use the market, open group chat, or access the web API.'
    );
    client.logOff();
  }
  if (communityBanned) {
    log.info('Account is banned from Steam Community');
    client.logOff();
  }
  if (locked) {
    log.info(
      'Account is locked. We cannot trade/gift/purchase items, play on VAC servers, or access Steam Community.  Shutting down.'
    );
    client.logOff();
    process.exit(1);
  }
  if (!canInviteFriends) {
    log.info('Account is unable to send friend requests.');
    client.logOff();
  }
});

// Console will show the current Wallet Balance of the Steam Account
client.on('wallet', function (hasWallet, currency, balance) {
  if (hasWallet) {
    log.info(
      `Wallet: ${SteamUser.formatCurrency(
        balance,
        currency
      )} Steam Credit remaining`
    );
  } else {
    log.info('We do not have a Steam wallet.');
  }
});

// Handle the messages we get via Steam Chat
client.on('friendMessage', (SENDER, MSG) => {
  // Writing the User Logs to File
  log.userChatFullMessages(SENDER, MSG);

  if (Object.keys(users).indexOf(SENDER.getSteamID64()) < 0) {
    users[SENDER.getSteamID64()] = {};
    users[SENDER.getSteamID64()].language = 'EN';
    users[SENDER.getSteamID64()].idleforhours = 0;
    fs.writeFile('./Data/User/Users.json', JSON.stringify(users), (ERR) => {
      if (ERR) {
        log.error(`An error occurred while writing UserData file: ${ERR}`);
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
    chatMessage(client, SENDER, 'You have been banned from using our services');
  } else if (client.myFriends[SENDER.getSteamID64()] === undefined) {
    chatMessage(client, SENDER, 'You need to add me as a friend');
  } else if (MSG.indexOf('[/tradeoffer]') >= 0) {
    chatMessage(
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
    return chatMessage(
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
        log.error(`Error trying to add ${SENDER.getSteamID64()}Reason:${err}`);
      } else if (name) {
        log.info(`Succesfully added ${SENDER.getSteamID64()} to friendlist.`);
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
    log.info(
      `User ID: ${SENDER.getSteamID64()} has deleted us from their friendlist.`
    );
  }
  // If the friend invite gets accepted
  if (REL === 3) {
    utils.inviteToGroup(client, community, SENDER.getSteamID64(), (err) => {
      if (err) {
        log.error(
          `An error occurred fetching user from the steam group: ${err}`
        );
      }
    });
    chatMessage(
      client,
      SENDER,
      `${messages.WELCOME.EN}
      ${messages.WELCOME.PT}
      ${messages.WELCOME.RU}
      ${messages.WELCOME.ES}
      ${messages.WELCOME.CN}
      ${messages.WELCOME.FR}
      ${messages.WELCOME.JA}
      ${messages.WELCOME.DE}`
    );
    chatMessage(client, SENDER, main.tutorial);
  }
});

// If the offer changes the state (example: Offer is created (1), confirmed (2) and the status changes to accepted (3) or declined (4).)
manager.on('sentOfferChanged', (OFFER) => {
  if (OFFER.state === 2) {
    // chatMessage(client, OFFER.partner, "Your trade has been confirmed! Click here to accept it: https://www.steamcommunity.com/tradeoffer/" + OFFER.id);
    log.tradeoffer(
      `Tradeoffer has been confirmed and is awaiting confirmation from User. TradeID:${OFFER.id}`
    );
  } else if (OFFER.state === 3) {
    log.tradeoffer(`Tradeoffer has been completed. TradeID:${OFFER.id}`);

    // Update stock
    inventory.updateStock(OFFER, client, community, allCards);

    // Invite steam group
    utils.inviteToGroup(
      client,
      community,
      OFFER.partner.getSteamID64(),
      (err) => {
        if (err) {
          log.error(
            `An error occurred fetching user from the steam group: ${err}`
          );
        }
      }
    );

    // Trades history
    log.tradesHistory(OFFER);

    let message = '/pre ';
    if (main.admins.indexOf(OFFER.partner.getSteamID64()) === -1) {
      // Notify the administrator of the exchanges made
      utils.notifyAdmin(client, users, OFFER);

      // Calculate profit
      profit.calculate(OFFER);

      // Add giveaway entry if user entered
      utils.addGiveawayEntry(OFFER, (ERR) => {
        if (ERR) {
          log.error(
            `An error occurred while writing giveaway entry file: ${ERR}`
          );
        } else {
          message +=
            messages.GIVEAWAY.ENTER[2][
              users[OFFER.partner.getSteamID64()].language
            ];
          log.warn('Giveaway entry added! ');
        }
      });

      // Access to sets4sets command
      utils.accesstosets4sets(OFFER, users, (ERR, numsets) => {
        if (ERR) {
          log.error(`An error occurred while writing UserData file: ${ERR}`);
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
        log.error(`An error occurred while getting user profile: ${ERR}`);
      } else {
        let canComment;
        const u = users[OFFER.partner.getSteamID64()];
        if (Object.prototype.hasOwnProperty.call(u, 'comments')) {
          if (
            Math.floor(new Date(utils.timeZone()).getTime() - u.comments) >
            1000 * 60 * 60 * main.comment.interval
          ) {
            canComment = 1;
          } else {
            canComment = 0;
          }
        } else {
          canComment = 1;
        }
        if (canComment && main.comment.enabled) {
          USER.comment(
            messages.COMMENT[users[OFFER.partner.getSteamID64()].language],
            (ERR1) => {
              if (ERR1) {
                log.error(
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
                      log.error(
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
          chatMessage(client, OFFER.partner.getSteamID64(), message);
        }
        utils.checkUserinGroup(
          community,
          OFFER.partner.getSteamID64(),
          (err, isMember) => {
            if (!err) {
              if (
                main.steamGroup.link &&
                main.steamGroup.doInvites &&
                !isMember
              ) {
                chatMessage(
                  client,
                  OFFER.partner.getSteamID64(),
                  messages.TRADE.DONE[0][
                    users[OFFER.partner.getSteamID64()].language
                  ].replace('{GROUP}', main.steamGroup.link)
                );
              } else {
                chatMessage(
                  client,
                  OFFER.partner.getSteamID64(),
                  messages.TRADE.DONE[1][
                    users[OFFER.partner.getSteamID64()].language
                  ]
                );
              }
            } else {
              chatMessage(
                client,
                OFFER.partner.getSteamID64(),
                messages.TRADE.DONE[1][
                  users[OFFER.partner.getSteamID64()].language
                ]
              );
              log.error(
                `An error occurred inviting user to steam group: ${err}`
              );
            }
          }
        );
      }
    });
  } else if (OFFER.state === 4) {
    chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.COUNTEROFFER[
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    log.tradeoffer(`Aborted because of counter offer. TradeID:${OFFER.id}`);
  } else if (OFFER.state === 5) {
    chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.EXPIRED[0][
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    log.tradeoffer(`Tradeoffer expired. TradeID:${OFFER.id}`);
  } else if (OFFER.state === 6) {
    chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.EXPIRED[1][
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    log.tradeoffer(`Tradeoffer canceled by Bot (expired). TradeID:${OFFER.id}`);
  } else if (OFFER.state === 7 || OFFER.state === 10) {
    chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.DECLINED.THEM[
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    log.tradeoffer(`Tradeoffer declined by User. TradeID:${OFFER.id}`);
  } else if (OFFER.state === 8) {
    chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.DECLINED.US[1][
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    log.tradeoffer(
      `Tradeoffer canceled by Bot (items unavailable). TradeID:${OFFER.id}`
    );
  } else if (OFFER.state === 11) {
    chatMessage(
      client,
      OFFER.partner,
      messages.TRADE.ESCROW[
        users[OFFER.partner.getSteamID64()].language
      ].replace('{OFFERID}', OFFER.id)
    );
    log.tradeoffer(
      `Tradeoffer aborted because user is in escrow and can't trade. TradeID:${OFFER.id}`
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
        log.error(`An error occurred while getting trade holds: ${ERR1}`);
        chatMessage(
          client,
          OFFER.partner,
          messages.ERROR.TRADEHOLD[users[OFFER.partner.getSteamID64()].language]
        );
        OFFER.decline((ERR2) => {
          if (ERR2) {
            log.error(`An error occurred while declining trade: ${ERR2}`);
          }
        });
      } else if (ME.escrowDays === 0 && THEM.escrowDays === 0) {
        OFFER.accept((ERR3) => {
          if (ERR3) {
            log.error(`An error occurred while accepting trade: ${ERR3}`);
            OFFER.decline((ERR4) => {
              if (ERR4) {
                log.error(`An error occurred while accepting trade: ${ERR4}`);
              }
            });
          } else {
            chatMessage(
              client,
              OFFER.partner,
              messages.TRADE.ACCEPTED[
                users[OFFER.partner.getSteamID64()].language
              ]
            );
          }
        });
      } else {
        chatMessage(
          client,
          OFFER.partner,
          messages.TRADEHOLD[users[OFFER.partner.getSteamID64()].language]
        );
        OFFER.decline((ERR5) => {
          if (ERR5) {
            log.error(`An error occurred while declining trade: ${ERR5}`);
          }
        });
      }
    });
  } else if (OFFER.itemsToGive.length === 0) {
    if (main.acceptDonations) {
      OFFER.accept((ERR) => {
        log.tradeoffer(`New Donation by user #${OFFER.partner.getSteamID64()}`);
        if (ERR) {
          log.error(`An error occurred while accepting trade: ${ERR}`);
        } else {
          for (let j = 0; j < main.admins.length; j += 1) {
            chatMessage(
              client,
              main.admins[j],
              messages.TRADE.NOTIFYADMIN.DONATION[
                users[OFFER.partner.getSteamID64()].language
              ].replace('{ID64}', OFFER.partner.getSteamID64())
            );
          }
          chatMessage(
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
          log.error(`An error occurred while declining trade: ${ERR}`);
        }
      });
      chatMessage(
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
        log.error(`An error occurred while declining trade: ${ERR}`);
      }
      chatMessage(
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
  log.tradeoffer('New confirmation.');
  community.acceptConfirmationForObject(main.identitySecret, CONF.id, (ERR) => {
    if (ERR) {
      log.error(`An error occurred while accepting confirmation: ${ERR}`);
    } else {
      log.tradeoffer('Confirmation accepted.');
    }
  });
});
