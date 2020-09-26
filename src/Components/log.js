const fs = require('fs');
const colour = require('cli-color');

const main = require('../Config/main');
const utils = require('../Utils/utils');

const log = {};

log.warn = (data) => {
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
        log.error(`An error occurred while writing warn logs file: ${ERR}`);
      }
    }
  );
};

log.error = (data) => {
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
        log.error(`An error occurred while writing Error logs file: ${ERR}`);
      }
    }
  );
};

log.info = (data) => {
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
        log.error(`An error occurred while writing Info logs file: ${ERR}`);
      }
    }
  );
};

log.userChat = (id64, userLang, data) => {
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
        log.error(`An error occurred while writing UserChat logs file: ${ERR}`);
      }
    }
  );
};

log.adminChat = (id64, userLang, data) => {
  const text = `${utils.date1()} @ [ ADMINCHAT: ${id64}][ ${userLang} ]${data}`;
  if (main.log.adminChat.enabled) {
    console.log(colour[main.log.adminChat.color](text));
  }
  fs.appendFile(
    `./Data/History/AdminChat/log-${utils.date2()}.txt`,
    `${text}\r\n`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        log.error(
          `An error occurred while writing AdminChat logs file: ${ERR}`
        );
      }
    }
  );
};

log.tradeoffer = (data) => {
  const text = `${utils.date1()} @ [ TRADEOFFER ] ${data}`;
  if (main.log.tradeOffer.enabled) {
    console.log(colour[main.log.tradeOffer.color](text));
  }
  fs.appendFile(
    `./Data/History/TradeOffer/log-${utils.date2()}.txt`,
    `${text}\r\n`,
    {
      flags: 'a',
    },
    (ERR) => {
      if (ERR) {
        log.error(
          `An error occurred while writing Tradeoffer logs file: ${ERR}`
        );
      }
    }
  );
};

log.botChatFullMessages = (id64, msg) => {
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
        log.error(`An error occurred while writing Bot ChatLogs file: ${ERR}`);
      }
    }
  );
};

log.userChatFullMessages = (id64, msg) => {
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
        log.error(`An error occurred while writing User ChatLogs file: ${ERR}`);
      }
    }
  );
};

log.tradesHistory = (offer) => {
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
        log.error(`An error occurred while writing trade file: ${ERR}`);
      }
    }
  );
};

module.exports = log;
