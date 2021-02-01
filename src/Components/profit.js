const fs = require('fs');
const utils = require('../Utils/utils');
const log = require('./log');

const initialize = () => {
  if (
    !fs.existsSync(
      `./Data/History/Profit/${`0${new Date().getMonth() + 1}`.slice(
        -2
      )}-${new Date().getFullYear()}.json`
    )
  ) {
    const profit = {
      totaltrades: 0,
      status: {
        sets: 0,
        csgo: 0,
        gems: 0,
        hydra: 0,
        tf: 0,
      },
      sell: {
        csgo: {
          sets: 0,
          currency: 0,
        },
        gems: {
          sets: 0,
          currency: 0,
        },
        hydra: {
          sets: 0,
          currency: 0,
        },
        tf: {
          sets: 0,
          currency: 0,
        },
      },
      buy: {
        csgo: {
          sets: 0,
          currency: 0,
        },
        gems: {
          sets: 0,
          currency: 0,
        },
        hydra: {
          sets: 0,
          currency: 0,
        },
        tf: {
          sets: 0,
          currency: 0,
        },
      },
    };

    fs.writeFile(
      `./Data/History/Profit/${`0${new Date().getMonth() + 1}`.slice(
        -2
      )}-${new Date().getFullYear()}.json`,
      JSON.stringify(profit),
      (ERR) => {
        if (ERR) {
          log.error(`An error occurred while writing profit file: ${ERR}`);
        }
      }
    );
  }
};

const read = async () => {
  try {
    initialize();
    return JSON.parse(
      await utils.readFileAsync(
        `./Data/History/Profit/${`0${new Date().getMonth() + 1}`.slice(
          -2
        )}-${new Date().getFullYear()}.json`
      )
    );
  } catch (error) {
    throw new Error(error);
  }
};

const calculate = async (offer) => {
  try {
    const profit = await read();

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
          log.error(`An error occurred while writing profit file: ${ERR}`);
        }
      }
    );
  } catch (error) {
    log.error(`An error occurred while getting profit file: ${error}`);
  }
};

module.exports = { calculate, read };
