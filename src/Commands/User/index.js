/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
const HELP = require('./GENERAL/HELP');
const COMMANDS = require('./GENERAL/COMMANDS');
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
const main = require('../../Config/main');
const { parseCommand } = require('../../Utils');

module.exports = (sender, msg, client, users, community, allCards, manager) => {
  const input = msg.toUpperCase().split(' ')[0];
  const ignoreCommands = main.ignoreCommands.map((el) => el.toUpperCase());
  const { acceptedCurrency, handleSuppliers, acceptedLanguages } = main;

  if (ignoreCommands.includes(input)) {
    return 'UNKNOW';
  }

  if (
    input.includes(`!KEYLIST`) &&
    !acceptedCurrency.CSGO &&
    !acceptedCurrency.TF2 &&
    !acceptedCurrency.HYDRA
  ) {
    return 'UNKNOW';
  }

  if (input.includes(`!TUTORIAL`) && main.tutorial === '') {
    return 'UNKNOW';
  }

  for (const key in acceptedCurrency) {
    if (typeof acceptedCurrency[key] !== 'boolean') {
      throw new Error(
        'Error in configuring accepted currencies: not is boolean'
      );
    } else if (input.includes(key.replace('2', '')) && !acceptedCurrency[key]) {
      return 'UNKNOW';
    }
  }

  for (const lang in acceptedLanguages) {
    if (!acceptedLanguages[lang] && input.includes(`!${lang}`)) {
      return 'UNKNOW';
    }
  }

  if (!handleSuppliers && input.includes('!SELL')) {
    return 'UNKNOW';
  }

  switch (input) {
    case parseCommand(input, '!COMMANDS | !COMMAND'):
      COMMANDS(sender, client, users);
      break;
    case '!HELP':
      HELP(sender, client, users, 'EN');
      break;
    case '!AJUDA':
      HELP(sender, client, users, 'PT');
      break;
    case '!ПОМОЩЬ':
      HELP(sender, client, users, 'RU');
      break;
    case '!AYUDA':
      HELP(sender, client, users, 'ES');
      break;
    case '!救命':
      HELP(sender, client, users, 'CN');
      break;
    case '!AIDER':
      HELP(sender, client, users, 'FR');
      break;
    case '!助けて':
      HELP(sender, client, users, 'JA');
      break;
    case '!HILFE':
      HELP(sender, client, users, 'DE');
      break;
    case parseCommand(
      input,
      '!LANG | !LANGUAGE | !SPRACHE | !IDIOMA | !LANGUE | !言語 | !ЯЗЫК'
    ):
      LANG(sender, client, users);
      break;
    case parseCommand(
      input,
      '!EN | !ENGLISH | !ENGLISCHE | !INGLÊS | !英语 | !英語 | !АНГЛИЙСКИЙ'
    ):
      EN(sender, client, users);
      break;
    case parseCommand(
      input,
      '!ES | !SPANISH | !SPANISCHE | !ESPANHOL | !西班牙语 | !スペイン語 | !ИСПАНСКИЙ'
    ):
      ES(sender, client, users);
      break;
    case parseCommand(
      input,
      '!PT | !PORTUGUESE | !PORTUGIESISCHE | !PORTUGUÊS | !葡萄牙语语言 | !ポルトガル語 | !ПОРТУГАЛЬСКИЙ'
    ):
      PT(sender, client, users);
      break;
    case parseCommand(
      input,
      '!CN | !CHINESE | !CHINESISCHE | !CHINÊS | !CHINO | !中文 | !中国語 | !КИТАЙСКИЙ'
    ):
      CN(sender, client, users);
      break;
    case parseCommand(
      input,
      '!RU | !RUSSIAN | !RUSSISCHE | !RUSSO | !RUSO | !俄语 | !ロシア語 | !РУССКИЙ'
    ):
      RU(sender, client, users);
      break;
    case parseCommand(
      input,
      '!FR | !FRANCE | !FRANKREICH | !FRANCÊS | !FRANCIA | !語言法國 | !言語フランス | !ФРАНЦИЯ'
    ):
      FR(sender, client, users);
      break;
    case parseCommand(
      input,
      '!JA | !JAPANESE | !JAPANISCH | !JAPONÊS | !語言日語 | !日本語日本語 | !ЯПОНСКИЙ'
    ):
      JA(sender, client, users);
      break;
    case parseCommand(
      input,
      '!DE | !GERMAN | !DEUTSCHE | !ALEMÂO | !德国的语言 | !ドイツ語 | !НЕМЕЦКИЙ'
    ):
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
    case parseCommand(input, '!PRICES | !PRICE | !RATES | !RATE'):
      PRICES(sender, client, users);
      break;
    case '!RANK':
      RANK(sender, client, users);
      break;
    case '!REPORT':
      REPORT(sender, msg, client, users);
      break;
    case parseCommand(input, '!STOCK | !STATS'):
      STOCK(sender, client, users);
      break;
    case '!TUTORIAL':
      TUTORIAL(sender, client, users);
      break;
    case parseCommand(input, '!SETS4SETS | !SET4SET'):
      SETS4SETS(sender, msg, client, users, community, allCards, manager);
      break;
    default:
      return 'UNKNOW';
  }
};
