const SteamUser = require('steam-user');
const log = require('./log');

module.exports = (client, community) => {
  function restart() {
    log.warn('Restarting...');
    client.relog();
  }

  setInterval(function checkSteamLogged() {
    community.loggedIn(function (err, loggedIn) {
      if (err) {
        log.warn('checkSteamLogged');
        if (
          err.message.indexOf('socket hang up') > -1 ||
          err.message.indexOf('ESOCKETTIMEDOUT') > -1
        ) {
          restart();
        } else {
          setTimeout(checkSteamLogged, 1000 * 10);
        }
      } else if (!loggedIn) {
        log.warn('WebLogin check : NOT LOGGED IN');
        restart();
      } else {
        log.warn('WebLogin check : LOGGED IN');
        client.setPersona(SteamUser.EPersonaState.LookingToTrade);
      }
    });
  }, 1000 * 60 * 15);
};
