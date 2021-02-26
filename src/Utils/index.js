/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-labels */

const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');
const util = require('util');

const main = require('../Config/main.js');
const messages = require('../Config/messages.js');
const rates = require('../Config/rates.js');

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
            sInventory = sInventory.filter(() => true);
          }
        }
      }
      sInventory = _.groupBy(
        sInventory,
        (CEconItem) => CEconItem.market_hash_name.split('-')[0]
      );
      _.forOwn(sInventory, (CEconItemArray, appid) => {
        sInventory[appid] = _.groupBy(CEconItemArray, 'classid');
      });
      callback(null, sInventory);
    }
  });
};

utils.getRep = async (SID) => {
  try {
    const options = {
      baseURL: 'https://steamrep.com/api/beta4/',
      method: 'GET',
      url: `reputation/${SID}`,
      params: {
        tagdetails: 1,
        extended: 1,
        json: 1,
      },
    };

    const { data } = await axios(options);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

utils.getBadges = (SID, callback) => {
  const options = {
    method: 'GET',
    url: `https://api.steampowered.com/IPlayerService/GetBadges/v1/`,
    params: {
      key: main.steamApiKey,
      steamid: SID,
    },
  };

  axios(options)
    .then((response) => {
      if (response.status === 200 && response.data) {
        const badges = {};
        const { response: data } = response.data;

        if (data.badges) {
          const {
            player_level: currentLevel,
            player_xp: totalXP,
            player_xp_needed_current_level: XPNeededCurrentLevel,
          } = data;
          const currentLevelXP = totalXP - XPNeededCurrentLevel;

          data.badges.forEach((badge) => {
            if (
              (badge.appid && badge.border_color === 0) ||
              badge.border_color !== 1
            ) {
              badges[badge.appid] = parseInt(badge.level, 10);
            }
          });

          callback(null, badges, currentLevel, currentLevelXP, totalXP);
        } else {
          callback('Empty Badge');
        }
      } else {
        callback(`statuscode: ${response.status}`);
      }
    })
    .catch((error) => {
      callback(error);
    });
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
          (ERR) => {
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

// eslint-disable-next-line consistent-return
utils.rate = () => {
  if (main.ratesInBotName.currency === 'CSGO') {
    return `${rates.csgo.sell}:1 CS:GO`;
  }
  if (main.ratesInBotName.currency === 'TF') {
    return `${rates.tf.sell}:1 TF2`;
  }
  if (main.ratesInBotName.currency === 'HYDRA') {
    return `${rates.hydra.sell}:1 HYDRA`;
  }
  if (main.ratesInBotName.currency === 'GEMS') {
    return `1:${rates.gems.sell} GEMS`;
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

utils.filterCommands = (msg, admin = false) => {
  const filter = main.ignoreCommands;
  let message = [];

  if (typeof msg === 'string') {
    message = [...String(msg).split(/\n/)];
    utils.removeCurrency(message, false);
  }

  if (Array.isArray(msg)) {
    message = [...msg];

    if (!admin) {
      utils.removeSuppliersCommands(message);
    }

    utils.removeCurrency(message, true);
  }

  if (filter.every((el) => el !== '')) {
    filter.forEach((com) => {
      const command = com.toUpperCase().replace('!', '');
      const regex = new RegExp(`\\b${command}\\b`);
      const index = message.findIndex((el) => regex.test(el));

      if (index !== -1) {
        message.splice(index, 1);
      }
    });
  }

  if (message.length === 0) {
    return msg;
  }

  return message;
};

utils.removeCurrency = (msg, sectionType) => {
  const currencies = main.acceptedCurrency;
  const suppliers = main.handleSuppliers;
  if (sectionType) {
    if (utils.isFalseAllObjectKeys(currencies)) {
      throw new Error(
        'Error in configuring accepted currencies: all currencies are disabled'
      );
    }

    for (const key in currencies) {
      if (!currencies[key]) {
        const currencySection = utils.parseCurrencies(key);
        const regex1 = new RegExp(`${currencySection}`, 'i');
        const items1 = msg.filter((el) => regex1.test(el));

        if (items1.length !== 0) {
          msg.remove(items1);
        }

        if (suppliers) {
          const currencySuppliersSection = `!SELL${key.replace('2', '')}`;
          const regex2 = new RegExp(`${currencySuppliersSection}`);
          const items2 = msg.filter((el) => regex2.test(el));

          if (items2.length !== 0) {
            msg.remove(items2);
          }
        }
      }
    }
  } else {
    for (const key in currencies) {
      if (!currencies[key]) {
        const currency = utils.parseCurrencies(key);

        const regex = new RegExp(`${currency}`, 'i');
        const items = msg.filter((el) => regex.test(el));

        if (items.length !== 0) {
          msg.remove(items);
        }
      }
    }
  }
};

utils.removeSuppliersCommands = (msg) => {
  const suppliers = main.handleSuppliers;
  if (!suppliers) {
    const indexSection = (cur) =>
      messages.HELP.EN.findIndex((el) => el.includes(cur));
    const section = msg[indexSection(`Suppliers Section.`)]?.replace(
      '. \n',
      ''
    );
    const index = msg.findIndex((el) => el.includes(section));
    if (index !== -1) {
      msg.splice(index, 6);
    }
  }
};

utils.isFalseAllObjectKeys = (obj) =>
  Object.values(obj).every((val) => val === false);

// eslint-disable-next-line no-extend-native
Array.prototype.remove = function (index = []) {
  const array = this;

  index.forEach((item) => {
    if (array.includes(item)) {
      array.splice(array.indexOf(item), 1);
    }
  });
};

utils.parseCurrencies = (currency) => {
  let key = '';

  if (currency === 'CSGO') {
    key = 'CSGO|CS:GO|CS|《反恐精英：全球攻势》|„CS:GO“';
  } else if (currency === 'TF2') {
    key = 'TF2|TF|团队要塞2|„TF2“';
  } else if (currency === 'HYDRA') {
    key = 'HYDRA|九头蛇|Гидра|Hidra|„Hydra“';
  } else if (currency === 'GEMS') {
    key = 'gem|gema|宝石|Самоцвет|gemme|ジェム|edelsteine';
  }

  return key;
};

utils.parseCommand = (input, command) => {
  const regex = new RegExp(`^(${String(command).replace(/( )/g, '')})$`);
  return (String(input).match(regex) || [])[0];
};

module.exports = utils;
