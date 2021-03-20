/* eslint-disable no-process-exit */
import moment from 'moment';
import { getAuthCode } from 'steam-totp';
import TradeOfferManager from 'steam-tradeoffer-manager';
import SteamUser from 'steam-user';
import SteamCommunity from 'steamcommunity';

import Log from './components/log.js';
import main from './config/main.js';

class Bot {
  #client = new SteamUser();

  #community = new SteamCommunity();

  #log = new Log();

  #manager = new TradeOfferManager({
    steam: this.#client,
    community: this.#community,
    language: 'en',
    pollInterval: moment.duration(2, 'hours'),
    cancelTime: moment.duration(20, 'seconds'),
    savePollData: true,
  });

  #login(options) {
    this.#client.logOn({
      accountName: options.userName,
      password: options.passWord,
      twoFactorCode: getAuthCode(options.sharedSecret),
      identity_secret: options.identitySecret,
      rememberPassword: true,
      shared_secret: options.sharedSecret,
    });
  }

  #restart() {
    this.#log.warn('Restarting...');
    if (!this.#client.steamID) {
      this.login(this.#client);
    } else {
      this.#client.relog();
    }
  }

  start() {
    this.#login({
      userName: main.userName,
      passWord: main.passWord,
      sharedSecret: main.sharedSecret,
      identitySecret: main.identitySecret,
    });

    this.#client.on('loggedOn', () => {
      this.#client.setPersona(SteamUser.EPersonaState.Online);
    });

    this.#client.on('webSession', (_, cookies) => {
      this.#manager.setCookies(cookies, (error) => {
        if (error) {
          this.#log.error('An error occurred while setting cookies.');
        } else {
          this.#log.info('Websession created and cookies set.');
        }
      });

      this.#community.setCookies(cookies);
      this.#community.startConfirmationChecker(moment.duration(20, 'seconds'), main.identitySecret);
    });

    this.#client.on('error', (error) => {
      const minutes = 25;
      const seconds = 5;

      switch (error.eresult) {
        case SteamUser.EResult.AccountDisabled:
          this.#log.error(`This account is disabled!`);
          break;
        case SteamUser.EResult.InvalidPassword:
          this.#log.error(`Invalid Password detected!`);
          break;
        case SteamUser.EResult.RateLimitExceeded:
          this.#log.warn(`Rate Limit Exceeded, trying to login again in ${minutes} minutes.`);
          setTimeout(() => {
            this.#restart();
          }, moment.duration(minutes, 'minutes'));
          break;
        case SteamUser.EResult.LogonSessionReplaced:
          this.#log.warn(
            `Unexpected Disconnection!, you have LoggedIn with this same account in another place. Trying to login again in ${seconds} seconds.`,
          );
          setTimeout(() => {
            this.#restart();
          }, moment.duration(seconds, 'seconds'));
          break;
        default:
          this.#log.warn(`Unexpected Disconnection!, trying to login again in ${seconds} seconds.`);
          setTimeout(() => {
            this.#restart();
          }, moment.duration(seconds, 'seconds'));
          break;
      }
    });

    this.#client.on('newItems', (count) => {
      this.#log.info(`We have ${count} new Items in our Inventory`);
    });

    this.#client.on('emailInfo', (address) => {
      this.#log.info(`E-Mail: ${address}`);
    });

    this.#client.on('accountLimitations', (limited, communityBanned, locked, canInviteFriends) => {
      if (limited) {
        this.#log.info(
          'Account is limited. Cannot send friend invites, use the market, open group chat, or access the web API.',
        );
        this.#client.logOff();
      }
      if (communityBanned) {
        this.#log.info('Account is banned from Steam Community');
        this.#client.logOff();
      }
      if (locked) {
        this.#log.info(
          'Account is locked. We cannot trade/gift/purchase items, play on VAC servers, or access Steam Community.  Shutting down.',
        );
        this.#client.logOff();
        process.exit(1);
      }
      if (!canInviteFriends) {
        this.#log.info('Account is unable to send friend requests.');
        this.#client.logOff();
      }
    });

    this.#client.on('wallet', (hasWallet, currency, balance) => {
      if (hasWallet) {
        this.#log.info(`Wallet: ${SteamUser.formatCurrency(balance, currency)} Steam Credit remaining`);
      } else {
        this.#log.info('We do not have a Steam wallet.');
      }
    });

    this.#client.on('friendMessage', (sender, msg) => {});

    this.#client.on('friendRelationship', (sender, rel) => {});

    this.#manager.on('sentOfferChanged', (offer) => {});

    this.#manager.on('newOffer', (offer) => {});

    this.#community.on('newConfirmation', (config) => {
      this.#log.tradeoffer('New confirmation.');
      this.#community.acceptConfirmationForObject(main.identitySecret, config.id, (error) => {
        if (error) {
          this.#log.error(`An error occurred while accepting confirmation: ${error}`);
        } else {
          this.#log.tradeoffer('Confirmation accepted.');
        }
      });
    });
  }
}

export default Bot;
