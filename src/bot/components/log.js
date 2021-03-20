import colour from 'cli-color';
import moment from 'moment';

import main from '../config/main.js';
import utils from '../utils/utils.js';

class Log {
  /**
   *
   * @param {string} data
   */
  warn(data) {
    const text = `${moment()} @ [ WARN ] ${data}`;
    if (main.log.warn.enabled) {
      console.log(colour[main.log.warn.color](text));
    }

    utils.persistToDisk(`./Data/History/Warn/log-${moment()}`, data, 'txt', 'append').catch((error) => {
      this.error(error);
    });
  }

  /**
   *
   * @param {string} data
   */
  info(data) {
    const text = `${moment()} @ [ INFO ] ${data}`;
    if (main.log.info.enabled) {
      console.log(colour[main.log.info.color](text));
    }

    utils.persistToDisk(`./Data/History/Info/log-${moment()}`, data, 'txt', 'append').catch((error) => {
      this.error(error);
    });
  }

  /**
   *
   * @param {string} data
   */
  userChat(data) {
    const text = `${moment()} @ [ CHAT ] ${data}`;
    if (main.log.chat.enabled) {
      console.log(colour[main.log.chat.color](text));
    }

    utils.persistToDisk(`./Data/History/Chat/log-${moment()}`, data, 'txt', 'append').catch((error) => {
      this.error(error);
    });
  }

  /**
   *
   * @param {string} data
   */
  adminChat(data) {
    const text = `${moment()} @ [ CHAT ] ${data}`;
    if (main.log.chat.enabled) {
      console.log(colour[main.log.chat.color](text));
    }

    utils.persistToDisk(`./Data/History/Chat/log-${moment()}`, data, 'txt', 'append').catch((error) => {
      this.error(error);
    });
  }

  /**
   *
   * @param {string} data
   */
  error(data) {
    const text = `${moment()} @ [ ERROR ] ${data}`;
    if (main.log.error.enabled) {
      console.log(colour[main.log.error.color](text));
    }

    utils.persistToDisk(`./Data/History/Error/log-${moment()}`, data, 'txt', 'append').catch((error) => {
      this.error(error);
    });
  }

  /**
   *
   * @param {string} data
   */
  tradeOffer(data) {
    const text = `${moment()} @ [ TRADEOFFER ] ${data}`;
    if (main.log.tradeOffer.enabled) {
      console.log(colour[main.log.tradeOffer.color](text));
    }

    utils.persistToDisk(`./Data/History/TradeOffer/log-${moment()}`, data, 'txt', 'append').catch((error) => {
      this.error(error);
    });
  }
}

export default Log;
