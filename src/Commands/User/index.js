/* eslint-disable consistent-return */
const HELPEN = require('./GENERAL/HELPEN');
const HELPPT = require('./GENERAL/HELPPT');
const HELPRU = require('./GENERAL/HELPRU');
const HELPES = require('./GENERAL/HELPES');
const HELPCN = require('./GENERAL/HELPCN');
const HELPFR = require('./GENERAL/HELPFR');
const HELPJA = require('./GENERAL/HELPJA');
const HELPDE = require('./GENERAL/HELPDE');
const LANG = require('./GENERAL/LANGUAGE');
const EN = require('./GENERAL/LANGUAGE/EN');
const ES = require('./GENERAL/LANGUAGE/ES');
const PT = require('./GENERAL/LANGUAGE/PT');
const CN = require('./GENERAL/LANGUAGE/CN');
const RU = require('./GENERAL/LANGUAGE/RU');
const FR = require('./GENERAL/LANGUAGE/FR');
const JA = require('./GENERAL/LANGUAGE/JA');
const DE = require('./GENERAL/LANGUAGE/DE');
const BUYANYCSGO = require('./CSGO/BUYANY');
const BUYANYGEMS = require('./GEMS/BUYANY');
const BUYANYHYDRA = require('./HYDRA/BUYANY');
const BUYANYTF = require('./TF/BUYANY');
const BUYCSGO = require('./CSGO/BUY');
const BUYGEMS = require('./GEMS/BUY');
const BUYHYDRA = require('./HYDRA/BUY');
const BUYTF = require('./TF/BUY');
const BUYONECSGO = require('./CSGO/BUYONE');
const BUYONEGEMS = require('./GEMS/BUYONE');
const BUYONEHYDRA = require('./HYDRA/BUYONE');
const BUYONETF = require('./TF/BUYONE');
const SELLCSGO = require('./CSGO/SELL');
const SELLGEMS = require('./GEMS/SELL');
const SELLHYDRA = require('./HYDRA/SELL');
const SELLTF = require('./TF/SELL');
const CHECK = require('./GENERAL/CHECK');
const CHECKONE = require('./GENERAL/CHECKONE');
const CHECKCSGO = require('./CSGO/CHECK');
const CHECKGEMS = require('./GEMS/CHECK');
const CHECKHYDRA = require('./HYDRA/CHECK');
const CHECKTF = require('./TF/CHECK');
const SELLCHECK = require('./GENERAL/SELLCHECK');
const ENTER = require('./GENERAL/ENTER');
const GIVEAWAY = require('./GENERAL/GIVEAWAY');
const INVITE = require('./GENERAL/INVITE');
const KEYLIST = require('./GENERAL/KEYLIST');
const LEVEL = require('./GENERAL/LEVEL');
const OWNER = require('./GENERAL/OWNER');
const PRICES = require('./GENERAL/PRICES');
const RANK = require('./GENERAL/RANK');
const REPORT = require('./GENERAL/REPORT');
const STOCK = require('./GENERAL/STOCK');
const TUTORIAL = require('./GENERAL/TUTORIAL');
const SETS4SETS = require('./GENERAL/SETS4SETS');

module.exports = (sender, msg, client, users, community, allCards, manager) => {
  switch (msg.toUpperCase().split(' ')[0]) {
    case '!HELP':
      HELPEN(sender, client, users);
      break;
    case '!AJUDA':
      HELPPT(sender, client);
      break;
    case '!ПОМОЩЬ':
      HELPRU(sender, client);
      break;
    case '!AYUDA':
      HELPES(sender, client);
      break;
    case '!救命':
      HELPCN(sender, client);
      break;
    case '!AIDER':
      HELPFR(sender, client, users);
      break;
    case '!助けて':
      HELPJA(sender, client, users);
      break;
    case '!HILFE':
      HELPDE(sender, client, users);
      break;
    case '!LANG':
      LANG(sender, client, users);
      break;
    case '!EN':
      EN(sender, client, users);
      break;
    case '!ES':
      ES(sender, client, users);
      break;
    case '!PT':
      PT(sender, client, users);
      break;
    case '!CN':
      CN(sender, client, users);
      break;
    case '!RU':
      RU(sender, client, users);
      break;
    case '!FR':
      FR(sender, client, users);
      break;
    case '!JA':
      JA(sender, client, users);
      break;
    case '!DE':
      DE(sender, client, users);
      break;
    case '!BUYANYCSGO':
      BUYANYCSGO(sender, msg, client, users, manager);
      break;
    case '!BUYANYGEMS':
      BUYANYGEMS(sender, msg, client, users, manager);
      break;
    case '!BUYANYHYDRA':
      BUYANYHYDRA(sender, msg, client, users, manager);
      break;
    case '!BUYANYTF':
      BUYANYTF(sender, msg, client, users, manager);
      break;
    case '!BUYCSGO':
      BUYCSGO(sender, msg, client, users, manager);
      break;
    case '!BUYGEMS':
      BUYGEMS(sender, msg, client, users, manager);
      break;
    case '!BUYHYDRA':
      BUYHYDRA(sender, msg, client, users, manager);
      break;
    case '!BUYTF':
      BUYTF(sender, msg, client, users, manager);
      break;
    case '!BUYONECSGO':
      BUYONECSGO(sender, msg, client, users, manager);
      break;
    case '!BUYONEGEMS':
      BUYONEGEMS(sender, msg, client, users, manager);
      break;
    case '!BUYONEHYDRA':
      BUYONEHYDRA(sender, msg, client, users, manager);
      break;
    case '!BUYONETF':
      BUYONETF(sender, msg, client, users, manager);
      break;
    case '!SELLCSGO':
      SELLCSGO(sender, msg, client, users, community, allCards, manager);
      break;
    case '!SELLGEMS':
      SELLGEMS(sender, msg, client, users, community, allCards, manager);
      break;
    case '!SELLHYDRA':
      SELLHYDRA(sender, msg, client, users, community, allCards, manager);
      break;
    case '!SELLTF':
      SELLTF(sender, msg, client, users, community, allCards, manager);
      break;
    case '!CHECK':
      CHECK(sender, msg, client, users);
      break;
    case '!CHECKONE':
      CHECKONE(sender, client, users);
      break;
    case '!CHECKCSGO':
      CHECKCSGO(sender, msg, client, users);
      break;
    case '!CHECKGEMS':
      CHECKGEMS(sender, msg, client, users);
      break;
    case '!CHECKHYDRA':
      CHECKHYDRA(sender, msg, client, users);
      break;
    case '!CHECKTF':
      CHECKTF(sender, msg, client, users);
      break;
    case '!SELLCHECK':
      SELLCHECK(sender, client, users, community, allCards);
      break;
    case '!ENTER':
      ENTER(sender, client, users);
      break;
    case '!GIVEAWAY':
      GIVEAWAY(sender, client, users);
      break;
    case '!INVITE':
      INVITE(sender, client, users, community);
      break;
    case '!KEYLIST':
      KEYLIST(sender, client, users);
      break;
    case '!LEVEL':
      LEVEL(sender, msg, client, users);
      break;
    case '!OWNER':
      OWNER(sender, client, users);
      break;
    case '!PRICES':
      PRICES(sender, client, users);
      break;
    case '!RANK':
      RANK(sender, client, users);
      break;
    case '!REPORT':
      REPORT(sender, msg, client, users);
      break;
    case '!STOCK':
      STOCK(sender, client, users);
      break;
    case '!TUTORIAL':
      TUTORIAL(sender, client, users);
      break;
    case '!SETS4SETS':
      SETS4SETS(sender, msg, client, users, community, allCards, manager);
      break;
    default:
      return 'UNKNOW';
  }
};
