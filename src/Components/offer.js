const messages = require('../Config/messages');
const utils = require('../Utils');
const log = require('./log');
const chatMessage = require('./message');

const makeOffer = (
  client,
  users,
  manager,
  target,
  itemsFromMe,
  itemsFromThem,
  commandused,
  message,
  amountofsets = 0,
  amountofleftovers = 0,
  amountofkeys = 0,
  amountofgems = 0
) => {
  const offer = manager.createOffer(target);
  const language = utils.getLanguage(target, users);

  offer.addMyItems(itemsFromMe);
  offer.addTheirItems(itemsFromThem);

  log.tradeoffer('Creating trade offer');

  offer.data('commandused', commandused);
  if (amountofsets) {
    offer.data('amountofsets', amountofsets);
  }
  if (amountofleftovers) {
    offer.data('amountofleftovers', amountofleftovers);
  }
  if (amountofkeys) {
    offer.data('amountofkeys', amountofkeys);
  }
  if (amountofgems) {
    offer.data('amountofgems', amountofgems);
  }

  offer.setMessage(message);
  offer.getUserDetails((ERR1, ME, THEM) => {
    if (ERR1) {
      log.error(`An error occurred while getting trade holds: ${ERR1}`);
      chatMessage(client, target, messages.ERROR.TRADEHOLD[language]);
    } else if (ME.escrowDays === 0 && THEM.escrowDays === 0) {
      log.tradeoffer('Sending trade offer');
      offer.send((ERR2) => {
        if (ERR2) {
          chatMessage(client, target, messages.ERROR.SENDTRADE[language]);
          log.error(`An error occurred while sending trade offer: ${ERR2}`);
        } else {
          chatMessage(client, target, `${messages.TRADEMSG[language]} \n\n`);
          log.tradeoffer(
            `offer #${offer.id} sent successfully to user #${target}`
          );
        }
      });
    } else {
      chatMessage(client, target, messages.TRADEHOLD[language]);
    }
  });
};

module.exports = makeOffer;
