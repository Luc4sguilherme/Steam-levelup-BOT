const SID64REGEX = new RegExp(/^[0-9]{17}$/);

const messages = require('../../../../Config/messages');
const chatMessage = require('../../../../Components/message');
const log = require('../../../../Components/log');
const reputation = require('../../../../Components/reputation');
const relationShip = require('../../../../Components/relationShip');
const customer = require('../../../../Components/customer');
const utils = require('../../../../Utils');

module.exports = (sender, msg, client, users, community, allCards) => {
  const language = utils.getLanguage(sender.getSteamID64(), users);

  chatMessage(client, sender, messages.REQUEST[language]);
  const id64 = msg.toUpperCase().replace('!USERCHECK ', '').toString();
  log.adminChat(sender.getSteamID64(), language, `[ !USERCHECK ${id64} ]`);
  if (SID64REGEX.test(id64)) {
    let message = '/pre ';

    relationShip(client, id64, (relation) => {
      message += messages.USERCHECK.RELATIONSHIP[relation][language];
    });

    reputation(id64)
      .then((infos) => {
        message += messages.USERCHECK.REPUTATION.DEFAULT[language];

        if (infos.summary) {
          message += messages.USERCHECK.REPUTATION[infos.summary][language];
        }

        if (infos.tags) {
          message += messages.USERCHECK.REPUTATION[infos.tags][language];
        }

        if (infos.vacban) {
          message += messages.USERCHECK.REPUTATION[infos.vacban][language];
        }

        if (infos.tradeban) {
          message += messages.USERCHECK.REPUTATION[infos.tradeban][language];
        }

        message += '\n';
      })
      .catch((error) => {
        log.error(`An error occurred while getting user in Steamrep: ${error}`);
      });

    customer.badge(id64, (error, botNSets, hisMaxSets) => {
      if (error) {
        chatMessage(client, sender, messages.ERROR.BADGES[3][language]);
        log.error(`An error occurred while getting badges: ${error}`);
      } else {
        message += messages.USERCHECK.SETSAVAILABLE[language]
          .replace('{SETS1}', hisMaxSets)
          .replace('{SETS2}', botNSets);
      }
    });

    customer.loadInventory(id64, community, allCards, (err) => {
      if (err) {
        chatMessage(
          client,
          sender,
          messages.ERROR.LOADINVENTORY.THEM[1][language]
        );
      } else {
        message += messages.USERCHECK.INVENTORY[language]
          .replace('{TOTALSETS}', customer.stock.totalSets)
          .replace('{CSKEYSTRADABLE}', customer.stock.csKeys.tradable)
          .replace('{HYDRAKEYSTRADABLE}', customer.stock.hydraKeys.tradable)
          .replace('{TFKEYSTRADABLE}', customer.stock.tfKeys.tradable)
          .replace(
            '{GEMSQUANTITYTRADABLE}',
            customer.stock.gemsQuantity.tradable
          )
          .replace('{CSKEYSNOTRADABLE}', customer.stock.csKeys.notradable)
          .replace('{HYDRAKEYSNOTRADABLE}', customer.stock.hydraKeys.notradable)
          .replace('{TFKEYSNOTRADABLE}', customer.stock.tfKeys.notradable)
          .replace(
            '{GEMSQUANTITYNOTRADABLE}',
            customer.stock.gemsQuantity.notradable
          );
        chatMessage(client, sender, message);
      }
    });
  } else {
    chatMessage(
      client,
      sender,
      messages.ERROR.INPUT.INVALID.STEAMID64[language]
    );
  }
};
