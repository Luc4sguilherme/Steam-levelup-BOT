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

utils.getPeriod = (period) => {
  switch (period) {
    case 'DAILY':
      return 'DAILY';
    case 'MONTHLY':
      return 'MONTHLY';
    case 'YEARLY':
      return 'YEARLY';
    case 'DIÁRIO':
      return 'DAILY';
    case 'MENSAL':
      return 'MONTHLY';
    case 'ANUAL':
      return 'YEARLY';
    case 'ЕЖЕДНЕВНАЯ':
      return 'DAILY';
    case 'ЕЖЕМЕСЯЧНАЯ':
      return 'MONTHLY';
    case 'ГОДОВАЯ':
      return 'YEARLY';
    case 'DIARIO':
      return 'DAILY';
    case 'MENSUAL':
      return 'MONTHLY';
    case '每日':
      return 'DAILY';
    case '每月':
      return 'MONTHLY';
    case '年度':
      return 'YEARLY';
    case 'QUOTIDIENNES':
      return 'DAILY';
    case 'MENSUELLES':
      return 'MONTHLY';
    case 'ANNUELLES':
      return 'YEARLY';
    case 'デイトレード':
      return 'DAILY';
    case '毎月の取引':
      return 'MONTHLY';
    case '年間取引':
      return 'YEARLY';
    case 'TÄGLICHE':
      return 'DAILY';
    case 'MONATLICHE':
      return 'MONTHLY';
    case 'JÄHRLICHE':
      return 'YEARLY';
    default:
      return 'MONTHLY';
  }
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
    message = utils.removeCurrency(message, false);
    message = utils.removeLanguages(message);
  }

  if (Array.isArray(msg)) {
    message = [...msg];

    if (!admin) {
      message = utils.removeSuppliersCommands(message);
    }

    message = utils.removeCurrency(message, true);

    if (main.tutorial === '') {
      const regex = new RegExp(`!TUTORIAL`);
      const items = message.filter((el) => regex.test(el));

      if (items.length !== 0) {
        message.remove(items);
      }
    }

    if (main.owner === '') {
      const regex = new RegExp(`!OWNER`);
      const items = message.filter((el) => regex.test(el));

      if (items.length !== 0) {
        message.remove(items);
      }
    }
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
  const currencies = main.acceptedCurrencies;
  const suppliers = main.handleSuppliers;
  const message = [...msg];

  if (utils.isFalseAllObjectValues(currencies)) {
    throw new Error(
      'Error in configuring accepted currencies: all currencies are disabled'
    );
  }

  if (!currencies.CSGO && !currencies.TF2 && !currencies.HYDRA) {
    const regex = new RegExp(`!KEYLIST`);
    const items = message.filter((el) => regex.test(el));

    if (items.length !== 0) {
      message.remove(items);
    }
  }

  if (sectionType) {
    for (const key in currencies) {
      if (!currencies[key]) {
        const currencySection = utils.parseCurrencies(key);
        const regex1 = new RegExp(`${currencySection}`, 'i');
        const items1 = message.filter((el) => regex1.test(el));

        if (items1.length !== 0) {
          message.remove(items1);
        }

        if (suppliers) {
          const currencySuppliersSection = `!SELL${key.replace('2', '')}`;
          const regex2 = new RegExp(`${currencySuppliersSection}`);
          const items2 = message.filter((el) => regex2.test(el));

          if (items2.length !== 0) {
            message.remove(items2);
          }
        }
      }
    }
  } else {
    if (!suppliers) {
      const regex = new RegExp(
        `\\bsell|vender|продать|售|vendre|売る|verkaufen\\b`,
        'i'
      );
      const index = message.findIndex((el) => regex.test(el));

      if (index !== -1) {
        message.splice(index, 6);
      }
    }

    for (const key in currencies) {
      if (!currencies[key]) {
        const currency = utils.parseCurrencies(key);

        const regex = new RegExp(`${currency}`, 'i');
        const items = message.filter((el) => regex.test(el));

        if (items.length !== 0) {
          message.remove(items);
        }
      }
    }
  }

  return message;
};

utils.removeLanguages = (msg) => {
  const languages = main.acceptedLanguages;
  const message = [...msg];

  if (utils.isFalseAllObjectValues(languages)) {
    throw new Error(
      'Error in configuring accepted languages: all languages are disabled'
    );
  }

  for (const language in languages) {
    if (!languages[language]) {
      const regex1 = new RegExp(`!${language}`);
      const items1 = message.filter((el) => regex1.test(el));

      if (items1.length !== 0) {
        message.remove(items1);
      }
    }
  }
  return message;
};

utils.removeSuppliersCommands = (msg) => {
  const suppliers = main.handleSuppliers;
  const message = [...msg];

  if (!suppliers) {
    const indexSection = (cur) =>
      messages.COMMANDS.EN.findIndex((el) => el.includes(cur));
    const section = message[indexSection(`Suppliers Section.`)]?.replace(
      '. \n',
      ''
    );
    const index = message.findIndex((el) => el.includes(section));
    if (index !== -1) {
      message.splice(index, 6);
    }
  }

  return message;
};

utils.removeKeys = (msg) => {
  const currencies = main.acceptedCurrencies;
  const message = msg.split('\n');
  for (const key in currencies) {
    if (!currencies[key]) {
      const currency = utils.parseCurrencies(key);

      const regex = new RegExp(`${currency}`, 'i');
      const index = message.findIndex((el) => regex.test(el));

      if (index.length !== 0) {
        if (key === 'CSGO') {
          message.splice(index + 1, 25, message[17]);
        }

        if (key === 'HYDRA') {
          message.splice(index, 1);
        }

        if (key === 'TF2') {
          message.splice(index, 2);
        }
      }
    }
  }

  if (message.length === 0) {
    return [msg];
  }

  return message;
};

utils.isFalseAllObjectValues = (obj) =>
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
  switch (currency) {
    case 'CSGO':
      return 'CSGO|CS:GO|CS|《反恐精英：全球攻势》|„CS:GO“';
    case 'TF2':
      return 'TF2|TF|团队要塞2|„TF2“';
    case 'HYDRA':
      return 'HYDRA|九头蛇|Гидра|Hidra|„Hydra“';
    case 'GEMS':
      return 'gem|gema|宝石|Самоцвет|gemme|ジェム|edelsteine';
    default:
      return '';
  }
};

utils.parseCommand = (input, command) => {
  const regex = new RegExp(`^(${String(command).replace(/( )/g, '')})$`);
  return (String(input).match(regex) || [])[0];
};

utils.getDefaultLanguage = () => {
  const { acceptedLanguages } = main;

  const defaultLanguage = Object.keys(acceptedLanguages).filter(
    (value) => String(acceptedLanguages[value]).toUpperCase() === 'DEFAULT'
  );

  if (defaultLanguage.length !== 0) {
    return defaultLanguage[0];
  }
  return 'EN';
};

utils.getOfferItemInfo = (item) => {
  const {
    name,
    appid,
    contextid,
    assetid,
    classid,
    market_fee_app: marketFeeApp,
    amount,
    tags,
  } = item;

  const Tags = tags.map((tag) => tag.name);

  return {
    name,
    appid,
    contextid,
    assetid,
    classid,
    marketFeeApp,
    amount,
    tags: Tags,
  };
};

utils.intersectionBy = (array1, array2, fn) => {
  const s = new Set(array2.map(fn));
  return array1.filter((x) => s.has(fn(x)));
};

utils.getExchangedItems = (
  community,
  id64,
  appid,
  contextid,
  exchangedItems,
  inventoryOf = 'BOT'
) =>
  new Promise((resolve, reject) => {
    community.getUserInventoryContents(
      id64,
      appid,
      contextid,
      true,
      (error, inv) => {
        if (error) {
          reject(error);
        } else {
          const itemsToReturn = [];
          const items = [...exchangedItems];
          const inventory = utils.intersectionBy(
            inv,
            exchangedItems,
            (x) => x.market_hash_name
          );

          for (let i = 0; i < inventory.length; i += 1) {
            for (let j = 0; j < items.length; j += 1) {
              if (
                items[j].market_hash_name === inventory[i].market_hash_name &&
                items[j].amount <= inventory[i].amount &&
                itemsToReturn.every((el) => el.assetid !== inventory[i].assetid)
              ) {
                const item = {
                  ...inventory[i],
                  amount: items[j].amount,
                };
                itemsToReturn.push(item);
                items.splice(j, 1);
              }
            }
          }

          if (itemsToReturn.length !== exchangedItems.length) {
            if (inventoryOf === 'BOT') {
              reject(new Error('BOT items are unavailable'));
            } else {
              reject(new Error('User items are unavailable'));
            }
          } else {
            const orderedItems = _.orderBy(itemsToReturn, [
              'market_hash_name',
              'classid',
              'name',
            ]);

            resolve(orderedItems);
          }
        }
      }
    );
  });

module.exports = utils;
