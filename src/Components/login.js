const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const main = require('../Config/main');
const log = require('./log');

const init = (client) => {
  try {
    client.logOn({
      accountName: main.userName,
      password: main.passWord,
      twoFactorCode: SteamTotp.getAuthCode(main.sharedSecret),
      identity_secret: main.identitySecret,
      rememberPassword: true,
      shared_secret: main.sharedSecret,
    });
  } catch (e) {
    log.error(e);
  }
};

const restart = (client) => {
  log.warn('Restarting...');
  if (!client.steamID) {
    init(client);
  } else {
    client.relog();
  }
};

function webLogin(client) {
  log.warn('Session Expired. Relogging.');

  try {
    client.webLogOn();
  } catch (e) {
    log.error(e);
  }
}

const check = (client, community) => {
  setInterval(function checkSteamLogged() {
    community.loggedIn(function (err, loggedIn) {
      if (err) {
        log.error(err);
        if (
          err.message.indexOf('socket hang up') > -1 ||
          err.message.indexOf('ESOCKETTIMEDOUT') > -1
        ) {
          webLogin(client);
        } else {
          restart(client);
        }
      } else if (!loggedIn) {
        webLogin(client);
      } else {
        client.setPersona(SteamUser.EPersonaState.LookingToTrade);
      }
    });
  }, 1000 * 60 * 15);
};

module.exports = {
  init,
  check,
  restart,
  webLogin,
};
