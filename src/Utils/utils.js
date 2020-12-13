/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-labels */

const _ = require('lodash');
const request = require('request-promise');
const fs = require('fs');
const util = require('util');

const main = require('../Config/main.js');
const messages = require('../Config/messages.js');

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
  } else if (language === 'FR') {
    arrayMonth[0] = 'Janvier';
    arrayMonth[1] = 'Février';
    arrayMonth[2] = 'Mars';
    arrayMonth[3] = 'Avril';
    arrayMonth[4] = 'Mai';
    arrayMonth[5] = 'Juin';
    arrayMonth[6] = 'Juillet';
    arrayMonth[7] = 'Août';
    arrayMonth[8] = 'Septembre';
    arrayMonth[9] = 'Octobre';
    arrayMonth[10] = 'Novembre';
    arrayMonth[11] = 'Décembre';
  } else if (language === 'JA') {
    arrayMonth[0] = '1月';
    arrayMonth[1] = '2月';
    arrayMonth[2] = '3月';
    arrayMonth[3] = '4月';
    arrayMonth[4] = '5月';
    arrayMonth[5] = '6月';
    arrayMonth[6] = '7月';
    arrayMonth[7] = '8月';
    arrayMonth[8] = '9月';
    arrayMonth[9] = '10月';
    arrayMonth[10] = '11月';
    arrayMonth[11] = '12月';
  } else if (language === 'DE') {
    arrayMonth[0] = 'Januar';
    arrayMonth[1] = 'Februar';
    arrayMonth[2] = 'März';
    arrayMonth[3] = 'April';
    arrayMonth[4] = 'Mai';
    arrayMonth[5] = 'Juni';
    arrayMonth[6] = 'Juli';
    arrayMonth[7] = 'August';
    arrayMonth[8] = 'September';
    arrayMonth[9] = 'Oktober';
    arrayMonth[10] = 'November';
    arrayMonth[11] = 'Dezember';
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

utils.getRep = async (SID) => {
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

  const response = await request(options);
  return response;
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
              (badge.appid && badge.border_color === 0) ||
              badge.border_color !== 1
            ) {
              b[badge.appid] = parseInt(badge.level, 10);
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

utils.addGiveawayEntry = (offer, callback) => {
  try {
    const giveawayEntry = JSON.parse(
      fs.readFileSync('./Data/Giveaway/giveaway.json')
    );
    if (giveawayEntry.active) {
      if (
        typeof giveawayEntry.entries[offer.partner.getSteamID64()] !==
        'undefined'
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
  } catch (error) {
    callback(error);
  }
};

utils.accesstosets4sets = (offer, users, callback) => {
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
  community.getGroupMembers(main.steamGroup.ID, (err, members) => {
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

utils.inviteToGroup = (client, community, target, callback) => {
  if (main.steamGroup.ID && main.steamGroup.doInvites) {
    const customer = target;
    utils.checkUserinGroup(community, customer, (err, isMember) => {
      if (!err) {
        if (!isMember) {
          client.inviteToGroup(customer, main.steamGroup.ID);
        }
      } else {
        callback(err);
      }
    });
  }
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
          .replace('{SETS2}', offer.data('amountofsets'));
      }

      client.chatMessage(main.admins[j], msg1);
    }
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
