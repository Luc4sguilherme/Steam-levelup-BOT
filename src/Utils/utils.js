/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-labels */

const _ = require('lodash');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');
const colour = require('cli-color');
const jsonfile = require('jsonfile');
const util = require('util');

const main = require('../Config/main.js');
const messages = require('../Config/messages.js');

const apiKey = main.steamLadderApiKey;

const utils = {};

utils.readFileAsync = util.promisify(fs.readFile);

utils.timeZone = () => {
  let timezone;
  if (
    main.timeZone.length === 0 ||
    main.timeZone === undefined ||
    main.timeZone === null
  ) {
    timezone = new Date().toLocaleString('en-US', {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  } else {
    timezone = new Date().toLocaleString('en-US', {
      timeZone: main.timeZone,
    });
  }
  return timezone;
};

utils.date1 = () => {
  const time = new Date(utils.timeZone());

  return `DATE: ${`0${time.getDate()}`.slice(-2)}/${`0${
    time.getMonth() + 1
  }`.slice(-2)}/${time.getFullYear()} | ${`0${time.getHours()}`.slice(
    -2
  )}:${`0${time.getMinutes()}`.slice(-2)}:${`0${time.getSeconds()}`.slice(-2)}`;
};

utils.date2 = () => {
  const time = new Date(utils.timeZone());
  return `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`;
};

utils.warn = (data) => {
  const text = `${utils.date1()} @ [ WARN ] ${data}`;
  if (main.log.warn.enabled) {
    console.log(colour[main.log.warn.color](text));
  }
  fs.appendFile(
    `./Data/History/Warn/log-${utils.date2()}.txt`,
    `${text}\r\n`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        utils.error(`An error occurred while writing warn logs file: ${ERR}`);
      }
    }
  );
};

utils.error = (data) => {
  const text = `${utils.date1()} @ [ ERROR ] ${data}`;
  if (main.log.error.enabled) {
    console.log(colour[main.log.error.color](text));
  }
  fs.appendFile(
    `./Data/History/Error/log-${utils.date2()}.txt`,
    `${text}\r\n`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        utils.error(`An error occurred while writing Error logs file: ${ERR}`);
      }
    }
  );
};

utils.info = (data) => {
  const text = `${utils.date1()} @ [ INFO ] ${data}`;
  if (main.log.info.enabled) {
    console.log(colour[main.log.info.color](text));
  }
  fs.appendFile(
    `./Data/History/Info/log-${utils.date2()}.txt`,
    `${text}\r\n`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        utils.error(`An error occurred while writing Info logs file: ${ERR}`);
      }
    }
  );
};

utils.userChat = (id64, userLang, data) => {
  const text = `${utils.date1()} @ [ USERCHAT: ${id64}][ ${userLang} ]${data}`;
  if (main.log.userChat.enabled) {
    console.log(colour[main.log.userChat.color](text));
  }
  fs.appendFile(
    `./Data/History/UserChat/log-${utils.date2()}.txt`,
    `${text}\r\n`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        utils.error(
          `An error occurred while writing UserChat logs file: ${ERR}`
        );
      }
    }
  );
};

utils.adminChat = (id64, userLang, data) => {
  const text = `${utils.date1()} @ [ ADMINCHAT: ${id64}][ ${userLang} ]${data}`;
  if (main.log.adminChat.enabled) {
    console.log(colour[main.log.adminChat.color](text));
  }
  fs.appendFile(
    `./Data/History/adminChat/log-${utils.date2()}.txt`,
    `${text}\r\n`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        utils.error(
          `An error occurred while writing AdminChat logs file: ${ERR}`
        );
      }
    }
  );
};

utils.tradeoffer = (data) => {
  const text = `${utils.date1()} @ [ TRADEOFFER ] ${data}`;
  if (main.log.tradeOffer.enabled) {
    console.log(colour[main.log.tradeOffer.color](text));
  }
  fs.appendFile(
    `./Data/History/Tradeoffer/log-${utils.date2()}.txt`,
    `${text}\r\n`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        utils.error(
          `An error occurred while writing Tradeoffer logs file: ${ERR}`
        );
      }
    }
  );
};

utils.botLogs = (id64, msg) => {
  const separator =
    '==========================================================';
  const dir = `./Data/ChatLogs/BotLogs/${utils.date2()}`;
  const timeZone = new Date(utils.timeZone());
  const time = `${`0${timeZone.getHours()}`.slice(
    -2
  )}:${`0${timeZone.getMinutes()}`.slice(
    -2
  )}:${`0${timeZone.getSeconds()}`.slice(-2)}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.appendFile(
    `${dir}/${id64}.txt`,
    `${separator} ${time} ${separator} 
    ${msg} \r\n\r\n`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        utils.error(
          `An error occurred while writing Bot ChatLogs file: ${ERR}`
        );
      }
    }
  );
};

utils.userLogs = (id64, msg) => {
  const dir = `./Data/ChatLogs/UserLogs/${utils.date2()}`;
  const timeZone = new Date(utils.timeZone());
  const time = `${`0${timeZone.getHours()}`.slice(
    -2
  )}:${`0${timeZone.getMinutes()}`.slice(
    -2
  )}:${`0${timeZone.getSeconds()}`.slice(-2)}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.appendFile(
    `${dir}/${id64}.txt`,
    `${time} --> ${msg} \r`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        utils.error(
          `An error occurred while writing User ChatLogs file: ${ERR}`
        );
      }
    }
  );
};

utils.chatMessage = (client, id64, msg) => {
  client.chatMessage(id64, msg);
  utils.botLogs(id64, msg);
};

utils.getMonth = (value, language) => {
  const arrayMonth = new Array(12);
  if (language === 'EN') {
    arrayMonth[0] = 'January';
    arrayMonth[1] = 'February';
    arrayMonth[2] = 'March';
    arrayMonth[3] = 'April';
    arrayMonth[4] = 'May';
    arrayMonth[5] = 'June';
    arrayMonth[6] = 'July';
    arrayMonth[7] = 'August';
    arrayMonth[8] = 'September';
    arrayMonth[9] = 'October';
    arrayMonth[10] = 'November';
    arrayMonth[11] = 'December';
  } else if (language === 'PT') {
    arrayMonth[0] = 'Janeiro';
    arrayMonth[1] = 'Fevereiro';
    arrayMonth[2] = 'Marcio';
    arrayMonth[3] = 'Abril';
    arrayMonth[4] = 'Maio';
    arrayMonth[5] = 'Junho';
    arrayMonth[6] = 'Julho';
    arrayMonth[7] = 'Agosto';
    arrayMonth[8] = 'Setembro';
    arrayMonth[9] = 'Outubro';
    arrayMonth[10] = 'Novembro';
    arrayMonth[11] = 'Dezembro';
  } else if (language === 'RU') {
    arrayMonth[0] = 'январь';
    arrayMonth[1] = 'Февраль';
    arrayMonth[2] = 'Март';
    arrayMonth[3] = 'Апрель';
    arrayMonth[4] = 'май';
    arrayMonth[5] = 'июнь';
    arrayMonth[6] = 'июль';
    arrayMonth[7] = 'Август';
    arrayMonth[8] = 'сентябрь';
    arrayMonth[9] = 'Октябрь';
    arrayMonth[10] = 'ноябрь';
    arrayMonth[11] = 'декабрь';
  } else if (language === 'ES') {
    arrayMonth[0] = 'enero';
    arrayMonth[1] = 'febrero';
    arrayMonth[2] = 'marzo';
    arrayMonth[3] = 'April';
    arrayMonth[4] = 'mayo';
    arrayMonth[5] = 'junio';
    arrayMonth[6] = 'julio';
    arrayMonth[7] = 'agosto';
    arrayMonth[8] = 'septiembre';
    arrayMonth[9] = 'octubre';
    arrayMonth[10] = 'noviembre';
    arrayMonth[11] = 'diciembre';
  } else if (language === 'CN') {
    arrayMonth[0] = '一月';
    arrayMonth[1] = '二月';
    arrayMonth[2] = '三月';
    arrayMonth[3] = '四月';
    arrayMonth[4] = '五月';
    arrayMonth[5] = '六月';
    arrayMonth[6] = '七月';
    arrayMonth[7] = '八月';
    arrayMonth[8] = ' 9月';
    arrayMonth[9] = '十月';
    arrayMonth[10] = '十一月';
    arrayMonth[11] = '十二月';
  }

  return arrayMonth[value];
};

utils.getleftovercards = (SID, community, cards, callback) => {
  community.getUserInventoryContents(SID, 753, 6, true, (ERR, INV) => {
    if (ERR) {
      callback(ERR);
    } else {
      const newInv = INV.filter(
        (ITEM) => ITEM.getTag('item_class').internal_name === 'item_class_2'
      );
      let sInventory = newInv;
      for (let j = 0; j <= cards.length; j += 1) {
        for (let i = 0; i <= sInventory.length; i += 1) {
          if (sInventory[i]) {
            if (cards[j] === sInventory[i].assetid) {
              delete sInventory[i];
            }
          } else {
            sInventory = sInventory.filter(function () {
              return true;
            });
          }
        }
      }
      sInventory = _.groupBy(
        sInventory,
        (CEconItem) => CEconItem.market_hash_name.split('-')[0]
      );
      _.forOwn(sInventory, function (CEconItemArray, appid) {
        sInventory[appid] = _.groupBy(CEconItemArray, 'classid');
      });
      callback(null, sInventory);
    }
  });
};

utils.getRep = async (SID, callback) => {
  const url = 'https://steamrep.com/api/beta4/reputation/';
  const options = {
    method: 'GET',
    uri: url + SID,
    qs: {
      tagdetails: 1,
      extended: 1,
      json: 1,
    },
  };

  await request(options)
    .then(function (response) {
      // Handle the response
      callback(null, response);
    })
    .catch(function (ERR) {
      // Deal with the error
      callback(ERR);
    });
};

utils.getRank = async (SID, callback) => {
  const baseURL = 'https://steamladder.com/api/v1';
  const options = {
    method: 'GET',
    uri: `${baseURL}/profile/${SID}`,
    json: true,
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  };

  await request(options)
    .then(function (response) {
      // Handle the response
      callback(
        null,
        response.ladder_rank.worldwide_xp,
        response.ladder_rank.region.region_xp,
        response.ladder_rank.country.country_xp
      );
    })
    .catch(function (ERR) {
      // Deal with the error
      callback(ERR);
    });
};

utils.updateRank = async (SID) => {
  const baseURL = 'https://steamladder.com/api/v1';
  const options = {
    method: 'POST',
    uri: `${baseURL}/profile/${SID}/`,
    json: true,
    headers: {
      Authorization: `Token ${apiKey}`,
    },
  };

  await request(options)
    .then(function () {
      // Handle the response
      utils.warn('Rank updated');
    })
    .catch(function (ERR) {
      // Deal with the error
      utils.error(`An error occurred while updating the rank: ${ERR}`);
    });
};

utils.maxSets = (cardsFromSortedInventory) => {
  let cardCounts = _.mapValues(
    cardsFromSortedInventory,
    (cardsArray) => cardsArray.length
  );
  cardCounts = Object.keys(cardCounts).map((key) => cardCounts[key]);
  return Math.min(...cardCounts);
};

utils.getCardsInSets = (callback) => {
  fs.readFile('./Data/Sets/set_data.json', 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      const c = JSON.parse(data);
      const d = {};
      for (let i = 0; i < c.sets.length; i += 1) {
        d[c.sets[i].appid] = {
          appid: c.sets[i].appid,
          name: c.sets[i].game,
          count: c.sets[i].normal.count,
        };
      }
      callback(null, d);
    }
  });
};

utils.getSets = (INV, DATA, callback) => {
  const s = {};
  _.forOwn(INV, (c, id) => {
    const uc = Object.keys(c).length;
    if (DATA[id.toString()] && uc === DATA[id.toString()].count) {
      const r = utils.maxSets(c);
      s[id.toString()] = [];
      for (let i = 0; i < r; i += 1) {
        const set = [];
        _.forOwn(c, (e) => {
          set.push(e[i]);
        });
        s[id.toString()].push(set);
      }
    } else if (!DATA[id.toString()]) {
      utils.warn(`Card set non-existent, skipping it ${id.toString()} `);
    }
  });
  callback(null, s);
};

utils.getBadges = (SID, callback) => {
  request(
    `https://api.steampowered.com/IPlayerService/GetBadges/v1/?key=${main.steamApiKey}&steamid=${SID}`,
    {
      json: true,
    },
    (ERR, RES, BODY) => {
      if (!ERR && RES.statusCode === 200 && BODY.response) {
        const badges = BODY.response;
        const b = {};
        // console.log(badges);
        if (badges.badges) {
          badges.badges.forEach(function (badge) {
            if (
              'appid' in badge &&
              (!badge.badge_border_color || badge.border_color !== 1)
            ) {
              b[badge.appid] = badge.level;
            }
          });
          callback(
            null,
            b,
            badges.player_level,
            badges.player_xp - badges.player_xp_needed_current_level,
            badges.player_xp
          );
        } else {
          callback(null, 'nobadges');
        }
      } else {
        callback(ERR);
      }
    }
  );
};

utils.getLevelExp = (level) => {
  const ExpForLevel = (tl) => Math.ceil(tl / 10) * 100;
  let exp = 0;
  for (let i = 0; i < level + 1; i += 1) {
    exp += ExpForLevel(i);
  }
  return exp;
};

utils.makeOffer = (
  client,
  users,
  manager,
  target,
  itemsFromMe,
  itemsFromThem,
  commandused,
  message,
  amountofsets = 0,
  amountofleftovers = 0,
  amountofkeys = 0,
  amountofgems = 0
) => {
  const offer = manager.createOffer(target);
  offer.addMyItems(itemsFromMe);
  offer.addTheirItems(itemsFromThem);

  utils.tradeoffer('Creating trade offer');

  offer.data('commandused', commandused);
  if (amountofsets) {
    offer.data('amountofsets', amountofsets);
  }
  if (amountofleftovers) {
    offer.data('amountofleftovers', amountofleftovers);
  }
  if (amountofkeys) {
    offer.data('amountofkeys', amountofkeys);
  }
  if (amountofgems) {
    offer.data('amountofgems', amountofgems);
  }

  offer.setMessage(message);
  offer.getUserDetails((ERR1, ME, THEM) => {
    if (ERR1) {
      utils.error(`An error occurred while getting trade holds: ${ERR1}`);
      client.chatMessage(
        target,
        messages.ERROR.TRADEHOLD[users[target].language]
      );
    } else if (ME.escrowDays === 0 && THEM.escrowDays === 0) {
      utils.tradeoffer('Sending trade offer');
      offer.send((ERR2) => {
        if (ERR2) {
          client.chatMessage(
            target,
            messages.ERROR.SENDTRADE[users[target].language]
          );
          utils.error(`An error occurred while sending trade offer: ${ERR2}`);
        } else {
          client.chatMessage(
            target,
            `${messages.TRADEMSG[users[target].language]} \n\n`
          );
          utils.tradeoffer(
            `offer #${offer.id} sent successfully to user #${target}`
          );
        }
      });
    } else {
      client.chatMessage(target, messages.TRADEHOLD[users[target].language]);
    }
  });
};

utils.addGiveawayEntry = (offer, callback) => {
  const giveawayEntry = jsonfile.readFileSync('./Data/Giveaway/giveaway.json');
  if (giveawayEntry.active) {
    if (
      typeof giveawayEntry.entries[offer.partner.getSteamID64()] !== 'undefined'
    ) {
      giveawayEntry.entries[offer.partner.getSteamID64()] += 1;
      fs.writeFile(
        './Data/Giveaway/giveaway.json',
        JSON.stringify(giveawayEntry, null, '\t'),
        function (ERR) {
          if (ERR) {
            callback(ERR);
          } else {
            callback(null);
          }
        }
      );
    }
  }
};

utils.accesstosets4sets = (offer, callback) => {
  const users = jsonfile.readFileSync('./Data/User/Users.json');
  const customer = users[offer.partner.getSteamID64()];
  if (typeof customer !== 'undefined' && offer.data('amountofsets') !== 0) {
    if (offer.data('commandused') === '!SETS4SETS') {
      customer.sets4sets.numsets -= parseInt(offer.data('amountofsets'), 10);
    } else if (customer.hasOwnProperty('sets4sets') !== false) {
      customer.sets4sets.numsets += parseInt(offer.data('amountofsets'), 10);
    } else {
      customer.sets4sets = {};
      customer.sets4sets.numsets = 0;
      customer.sets4sets.numsets += parseInt(offer.data('amountofsets'), 10);
    }
    fs.writeFile('./Data/User/Users.json', JSON.stringify(users), (ERR) => {
      if (ERR) {
        callback(ERR);
      } else {
        callback(null, customer.sets4sets.numsets);
      }
    });
  }
};

utils.checkUserinGroup = (community, target, callback) => {
  const customer = target;
  community.getGroupMembers(main.groupID, (err, members) => {
    if (!err) {
      const m = [];
      for (let i = 0; i < members.length; i += 1) {
        m[i] = members[i].getSteamID64();
      }
      if (m.indexOf(customer) === -1) {
        callback(null, false);
      } else {
        callback(null, true);
      }
    } else {
      callback(err);
    }
  });
};

utils.inviteToGroup = (client, community, target) => {
  if (main.groupID && main.doGroupInvites) {
    const customer = target;
    utils.checkUserinGroup(community, customer, (err, isMember) => {
      if (!err) {
        if (!isMember) {
          client.inviteToGroup(customer, main.groupID);
        }
      } else {
        utils.error(
          `An error occurred fetching user from the steam group: ${err}`
        );
      }
    });
  }
};

utils.tradesHistory = (offer) => {
  let d = `Command: ${offer.data('commandused')}`;
  if (offer.data('amountofsets')) {
    d += `\nSets: ${offer.data('amountofsets')}`;
  }
  if (offer.data('amountofleftovers')) {
    d += `\nLeftovers: ${offer.data('amountofleftovers')}`;
  }
  if (offer.data('amountofkeys')) {
    d += `\nKeys: ${offer.data('amountofkeys')}`;
  }
  if (offer.data('amountofgems')) {
    d += `\nGems: ${offer.data('amountofgems')}`;
  }
  d += `\nSteamID: ${offer.partner.getSteamID64()}`;
  fs.writeFile(
    `./Data/TradesAccepted/${offer.id}-${offer.partner.getSteamID64()}.txt`,
    d,
    (ERR) => {
      if (ERR) {
        utils.error(`An error occurred while writing trade file: ${ERR}`);
      }
    }
  );
};

utils.notifyAdmin = (client, users, offer) => {
  if (main.getTradeMessages) {
    for (let j = 0; j < main.admins.length; j += 1) {
      let msg1 = messages.TRADE.NOTIFYADMIN.DEFAULT.RESPONSE[
        users[main.admins[j]].language
      ]
        .replace('{COMMAND}', offer.data('commandused'))
        .replace('{ID64}', offer.partner.getSteamID64());
      if (
        offer.data('commandused').search(/BUY/) !== -1 ||
        offer.data('commandused').search(/SELL/) !== -1
      ) {
        if (offer.data('commandused').search(/CSGO/) !== -1) {
          msg1 += messages.TRADE.NOTIFYADMIN.DEFAULT.CURRENCIES.CSGO[
            users[main.admins[j]].language
          ]
            .replace('{SETS}', offer.data('amountofsets'))
            .replace('{CSGO}', offer.data('amountofkeys'));
        }
        if (offer.data('commandused').search(/HYDRA/) !== -1) {
          msg1 += messages.TRADE.NOTIFYADMIN.DEFAULT.CURRENCIES.HYDRA[
            users[main.admins[j]].language
          ]
            .replace('{SETS}', offer.data('amountofsets'))
            .replace('{HYDRA}', offer.data('amountofkeys'));
        }
        if (offer.data('commandused').search(/TF/) !== -1) {
          msg1 += messages.TRADE.NOTIFYADMIN.DEFAULT.CURRENCIES.TF[
            users[main.admins[j]].language
          ]
            .replace('{SETS}', offer.data('amountofsets'))
            .replace('{TF}', offer.data('amountofkeys'));
        }
        if (offer.data('commandused').search(/GEMS/) !== -1) {
          msg1 += messages.TRADE.NOTIFYADMIN.DEFAULT.CURRENCIES.GEMS[
            users[main.admins[j]].language
          ]
            .replace('{SETS}', offer.data('amountofsets'))
            .replace('{GEMS}', offer.data('amountofgems'));
        }
      }
      if (offer.data('commandused').search(/SETS4SETS/) !== -1) {
        msg1 += messages.TRADE.NOTIFYADMIN.DEFAULT.CURRENCIES.SETS[
          users[main.admins[j]].language
        ]
          .replace('{SETS1}', offer.data('amountofsets'))
          .replace('{SETS2}', offer.data('amountofsets_user'));
      }

      client.chatMessage(main.admins[j], msg1);
    }
  }
};

utils.calculateProfit = async (offer) => {
  try {
    const profit = JSON.parse(
      await utils.readFileAsync(
        `./Data/History/Profit/${`0${new Date().getMonth() + 1}`.slice(
          -2
        )}-${new Date().getFullYear()}.json`
      )
    );

    if (offer.data('commandused').search(/BUY/) !== -1) {
      profit.totaltrades += 1;
      if (offer.data('commandused').search(/CSGO/) !== -1) {
        profit.buy.csgo.sets += parseInt(offer.data('amountofsets'), 10);
        profit.buy.csgo.currency += parseInt(offer.data('amountofkeys'), 10);
        profit.status.csgo += parseInt(offer.data('amountofkeys'), 10);
        profit.status.sets -= parseInt(offer.data('amountofsets'), 10);
      }
      if (offer.data('commandused').search(/HYDRA/) !== -1) {
        profit.buy.hydra.sets += parseInt(offer.data('amountofsets'), 10);
        profit.buy.hydra.currency += parseInt(offer.data('amountofkeys'), 10);
        profit.status.hydra += parseInt(offer.data('amountofkeys'), 10);
        profit.status.sets -= parseInt(offer.data('amountofsets'), 10);
      }
      if (offer.data('commandused').search(/TF/) !== -1) {
        profit.buy.tf.sets += parseInt(offer.data('amountofsets'), 10);
        profit.buy.tf.currency += parseInt(offer.data('amountofkeys'), 10);
        profit.status.tf += parseInt(offer.data('amountofkeys'), 10);
        profit.status.sets -= parseInt(offer.data('amountofsets'), 10);
      }
      if (offer.data('commandused').search(/GEMS/) !== -1) {
        profit.buy.gems.sets += parseInt(offer.data('amountofsets'), 10);
        profit.buy.gems.currency += parseInt(offer.data('amountofgems'), 10);
        profit.status.gems += parseInt(offer.data('amountofgems'), 10);
        profit.status.sets -= parseInt(offer.data('amountofsets'), 10);
      }
    }
    if (offer.data('commandused').search(/SELL/) !== -1) {
      profit.totaltrades += 1;
      if (offer.data('commandused').search(/CSGO/) !== -1) {
        profit.sell.csgo.sets += parseInt(offer.data('amountofsets'), 10);
        profit.sell.csgo.currency += parseInt(offer.data('amountofkeys'), 10);
        profit.status.csgo -= parseInt(offer.data('amountofkeys'), 10);
        profit.status.sets += parseInt(offer.data('amountofsets'), 10);
      }
      if (offer.data('commandused').search(/HYDRA/) !== -1) {
        profit.sell.hydra.sets += parseInt(offer.data('amountofsets'), 10);
        profit.sell.hydra.currency += parseInt(offer.data('amountofkeys'), 10);
        profit.status.hydra -= parseInt(offer.data('amountofkeys'), 10);
        profit.status.sets += parseInt(offer.data('amountofsets'), 10);
      }
      if (offer.data('commandused').search(/TF/) !== -1) {
        profit.sell.tf.sets += parseInt(offer.data('amountofsets'), 10);
        profit.sell.tf.currency += parseInt(offer.data('amountofkeys'), 10);
        profit.status.tf -= parseInt(offer.data('amountofkeys'), 10);
        profit.status.sets += parseInt(offer.data('amountofsets'), 10);
      }
      if (offer.data('commandused').search(/GEMS/) !== -1) {
        profit.sell.gems.sets += parseInt(offer.data('amountofsets'), 10);
        profit.sell.gems.currency += parseInt(offer.data('amountofgems'), 10);
        profit.status.gems -= parseInt(offer.data('amountofgems'), 10);
        profit.status.sets += parseInt(offer.data('amountofsets'), 10);
      }
    }
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
  } catch (error) {
    utils.error(`An error occurred while getting profit.json : ${error}`);
  }
};

utils.playLoading = {
  playThis: ['', true],
  moon: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],
  count: 0,
  timer: null,
  startTimer: function (client) {
    this.timer = setInterval(() => {
      this.playThis[0] = `${this.moon[this.count]} Loading...`;
      this.count += 1;

      if (this.count > 7) {
        this.count = 0;
      }

      client.gamesPlayed(this.playThis);
    }, 500);
  },
  resetTimer: function () {
    this.count = 0;
    clearInterval(this.timer);
  },
};

utils.request = (ID64, community, allCards, manager, inventory, callback) => {
  if (ID64) {
    utils.warn(`Auto Request to #${ID64}`);
    inventory.getInventory(ID64, community, (ERR1, DATA1) => {
      if (!ERR1) {
        const s = DATA1;
        utils.getSets(s, allCards, (ERR2, DATA2) => {
          utils.warn('SETS LOADED');
          if (!ERR2) {
            let userNSets = 0;
            for (let i = 0; i < Object.keys(DATA2).length; i += 1) {
              userNSets += DATA2[Object.keys(DATA2)[i]].length;
            }
            utils.warn('Creating trade offer');
            const t = manager.createOffer(ID64);
            let amountofB = main.requester.amount
              ? main.requester.amount
              : userNSets;
            const setsSent = {};
            const cardsSent = {};
            const Cards = {};
            for (let j = 0; j < Object.keys(DATA1).length; j += 1) {
              Cards[Object.keys(DATA1)[j]] = Object.values(
                Object.values(DATA1)[j]
              );
            }
            utils.sortSetsByAmountB(s, (DATA3) => {
              firstLoop: for (let i = 0; i < DATA3.length; i += 1) {
                if (DATA2[DATA3[i]]) {
                  for (let j = 0; j < DATA2[DATA3[i]].length; j += 1) {
                    if (amountofB > 0) {
                      if (!setsSent[DATA3[i]]) {
                        setsSent[DATA3[i]] = 0;
                      }
                      if (
                        main.requester.ignoreLimit
                          ? true
                          : setsSent[DATA3[i]] +
                              (inventory.botSets[DATA3[i]]
                                ? inventory.botSets[DATA3[i]].length
                                : 0) <
                            main.maxStock
                      ) {
                        t.addTheirItems(DATA2[DATA3[i]][j]);
                        amountofB -= 1;
                        setsSent[DATA3[i]] += 1;
                      } else {
                        continue firstLoop;
                      }
                    } else {
                      continue firstLoop;
                    }
                  }
                } else if (main.requester.sendLeftOvers) {
                  if (Cards[DATA3[i]]) {
                    for (let j = 0; j < Cards[DATA3[i]].length; j += 1) {
                      for (let k = 0; k < Cards[DATA3[i]][j].length; k += 1) {
                        if (
                          (cardsSent[DATA3[i]] && cardsSent[DATA3[i]] > -1) ||
                          !cardsSent[DATA3[i]]
                        ) {
                          t.addTheirItems(Cards[DATA3[i]][j]);
                          if (!cardsSent[DATA3[i]]) {
                            cardsSent[DATA3[i]] = 1;
                          } else {
                            cardsSent[DATA3[i]] += 1;
                          }
                        } else {
                          continue firstLoop;
                        }
                      }
                    }
                  } else {
                    continue;
                  }
                } else {
                  continue;
                }
              }
            });
            let amountofSets = 0;
            let amountofleftovers = 0;
            for (const key in setsSent) {
              if (Object.prototype.hasOwnProperty.call(setsSent, key)) {
                amountofSets += setsSent[key];
              }
            }
            for (const key in cardsSent) {
              if (Object.prototype.hasOwnProperty.call(cardsSent, key)) {
                amountofleftovers += cardsSent[key];
              }
            }
            callback(true);
            if (
              (main.requester.sendLeftOvers && amountofleftovers > 0) ||
              amountofSets > 0
            ) {
              utils.warn('Sending trade offer');
              t.data('commandused', 'AUTOREQUEST');
              t.data('amountofsets', amountofSets.toString());
              t.data('amountofleftovers', amountofleftovers.toString());
              t.data('amountofgems', 0);
              t.data('amountofkeys', 0);
              t.setMessage('Auto Request');
              t.send((ERR3) => {
                if (ERR3) {
                  utils.error(
                    `An error occurred while sending trade offer: ${ERR3}`
                  );
                } else {
                  utils.warn(`offer #${t.id} sent successfully`);
                }
              });
            } else {
              utils.warn("Didn't find cards to requests.");
            }
          } else {
            utils.error(`An error occurred while getting user sets: ${ERR2}`);
          }
        });
      } else {
        utils.error(`An error occurred while getting user inventory: ${ERR1}`);
      }
    });
  } else {
    utils.error('An error occurred while auto request: target is not defined');
  }
};

// Sorting Sets by Amout but reversed
utils.sortSetsByAmount = (SETS, callback) => {
  callback(
    Object.keys(SETS)
      .sort((k1, k2) => SETS[k1].length - SETS[k2].length)
      .reverse()
  );
};

// Sorting Sets by Amout
utils.sortSetsByAmountB = (SETS, callback) => {
  callback(
    Object.keys(SETS).sort((k1, k2) => SETS[k1].length - SETS[k2].length)
  );
};

module.exports = utils;
