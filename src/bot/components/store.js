import moment from 'moment';

import utils from '../utils/utils.js';

class Store {
  /**
   *
   * @param {string} id64
   * @param {string} type - 'USER' or 'BOT'
   * @param {string} msg
   */
  static chatData(id64, type = 'USER', msg) {
    const separator = '==========================================================';
    const timeZone = new Date(utils.timeZone());
    const time = `${`0${timeZone.getHours()}`.slice(-2)}:${`0${timeZone.getMinutes()}`.slice(
      -2,
    )}:${`0${timeZone.getSeconds()}`.slice(-2)}`;

    let dir = '';
    let data = '';

    if (type === 'USER') {
      dir = `./Data/ChatLogs/UserLogs/${utils.date2()}/${id64}`;
      data = `${time} --> ${msg} \r\n`;
    } else if (type === 'BOT') {
      dir = `./Data/ChatLogs/BotLogs/${utils.date2()}`;
      data = `${separator} ${time} ${separator}`;
    }

    utils.persistToDisk(dir, data, 'txt', 'append');
  }

  /**
   *
   * @param {string} offer
   */
  static trade(offer) {
    const itemsSent = offer.itemsToGive.map(utils.getOfferItemInfo);
    const itemsReceived = offer.itemsToReceive.map(utils.getOfferItemInfo);

    let data = `Command: ${offer.data('commandused')}`;
    if (offer.data('amountofsets')) {
      data += `\nSets: ${offer.data('amountofsets')}`;
    }
    if (offer.data('amountofleftovers')) {
      data += `\nLeftovers: ${offer.data('amountofleftovers')}`;
    }
    if (offer.data('amountofkeys')) {
      data += `\nKeys: ${offer.data('amountofkeys')}`;
    }
    if (offer.data('amountofgems')) {
      data += `\nGems: ${offer.data('amountofgems')}`;
    }
    if (offer.data('amountofboosters')) {
      data += `\nBoosters: ${offer.data('amountofboosters')}`;
    }

    data += `\nSteamID: ${offer.partner.getSteamID64()}`;
    data += `\nOfferID: ${offer.id}`;
    data += `\nCreatedDate: ${moment(offer.created).toISOString()}`;
    data += `\nCompletedDate: ${moment(offer.updated).toISOString()}`;
    data += `\nItemsSent: ${JSON.stringify(itemsSent, null, 2)}`;
    data += `\nItemsReceived: ${JSON.stringify(itemsReceived, null, 2)}`;

    utils.persistToDisk(`./Data/AcceptedTrades/${offer.id}-${offer.partner.getSteamID64()}`, data, 'txt', 'write');
  }
}

export default Store;
