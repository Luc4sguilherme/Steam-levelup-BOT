const ADMIN = require('./GENERAL/ADMIN');
const AUTHCODE = require('./GENERAL/AUTHCODE');
const BLOCK = require('./GENERAL/BLOCK');
const BROADCAST = require('./GENERAL/BROADCAST');
const DIE = require('./GENERAL/DIE');
const PROFIT = require('./GENERAL/PROFIT');
const RAFFLE = require('./GENERAL/RAFFLE');
const RELOAD = require('./GENERAL/RELOAD');
const REQUESTER = require('./GENERAL/REQUESTER');
const RESTART = require('./GENERAL/RESTART');
const RESTOCK = require('./GENERAL/RESTOCK');
const UNBLOCK = require('./GENERAL/UNBLOCK');
const UNPACK = require('./GENERAL/UNPACK');
const USERCHECK = require('./GENERAL/USERCHECK');
const WITHDRAWBOOSTER = require('./BOOSTER/WITHDRAW');
const WITHDRAWCSGO = require('./CSGO/WITHDRAW');
const WITHDRAWGEMS = require('./GEMS/WITHDRAW');
const WITHDRAWHYDRA = require('./HYDRA/WITHDRAW');
const WITHDRAWTF = require('./TF/WITHDRAW');
const WITHDRAWSETS = require('./SETS/WITHDRAW');
const WITHDRAWLEFTOVER = require('./GENERAL/WITHDRAWLEFTOVER');
const DEPOSITBOOSTER = require('./BOOSTER/DEPOSIT');
const DEPOSITCSGO = require('./CSGO/DEPOSIT');
const DEPOSITGEMS = require('./GEMS/DEPOSIT');
const DEPOSITHYDRA = require('./HYDRA/DEPOSIT');
const DEPOSITTF = require('./TF/DEPOSIT');
const DEPOSITSETS = require('./SETS/DEPOSIT');

function admin(sender, msg, client, users, community, allCards, manager) {
  switch (msg.toUpperCase().split(' ')[0]) {
    case '!ADMIN':
      ADMIN(sender, client, users);
      break;
    case '!AUTHCODE':
      AUTHCODE(sender, client, users);
      break;
    case '!BLOCK':
      BLOCK(sender, msg, client, users);
      break;
    case '!BROADCAST':
      BROADCAST(sender, msg, client, users);
      break;
    case '!DIE':
      DIE(sender, client, users);
      break;
    case '!PROFIT':
      PROFIT(sender, client, users);
      break;
    case '!RAFFLE':
      RAFFLE(sender, client, users);
      break;
    case '!RELOAD':
      RELOAD(sender, client, users, community, allCards);
      break;
    case '!REQUESTER':
      REQUESTER(sender, client, users, community, allCards, manager);
      break;
    case '!RESTART':
      RESTART(sender, client, users);
      break;
    case '!RESTOCK':
      RESTOCK(sender, client, users, community, allCards, manager);
      break;
    case '!UNBLOCK':
      UNBLOCK(sender, msg, client, users);
      break;
    case '!UNPACK':
      UNPACK(sender, client, users, community, manager);
      break;
    case '!USERCHECK':
      USERCHECK(sender, msg, client, users, community, allCards);
      break;
    case '!WITHDRAWLEFTOVER':
      WITHDRAWLEFTOVER(sender, client, users, community, manager);
      break;
    case '!WITHDRAWBOOSTER':
      WITHDRAWBOOSTER(sender, msg, client, users, manager);
      break;
    case '!WITHDRAWCSGO':
      WITHDRAWCSGO(sender, msg, client, users, manager);
      break;
    case '!WITHDRAWGEMS':
      WITHDRAWGEMS(sender, msg, client, users, manager);
      break;
    case '!WITHDRAWHYDRA':
      WITHDRAWHYDRA(sender, msg, client, users, manager);
      break;
    case '!WITHDRAWTF':
      WITHDRAWTF(sender, msg, client, users, manager);
      break;
    case '!WITHDRAWSETS':
      WITHDRAWSETS(sender, msg, client, users, manager);
      break;
    case '!DEPOSITBOOSTER':
      DEPOSITBOOSTER(sender, msg, client, users, manager);
      break;
    case '!DEPOSITCSGO':
      DEPOSITCSGO(sender, msg, client, users, manager);
      break;
    case '!DEPOSITGEMS':
      DEPOSITGEMS(sender, msg, client, users, manager);
      break;
    case '!DEPOSITHYDRA':
      DEPOSITHYDRA(sender, msg, client, users, manager);
      break;
    case '!DEPOSITTF':
      DEPOSITTF(sender, msg, client, users, manager);
      break;
    case '!DEPOSITSETS':
      DEPOSITSETS(sender, msg, client, users, community, allCards, manager);
      break;
    default:
      return 'UNKNOW';
  }
}

module.exports = admin;
