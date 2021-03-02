const User = require('./User');
const Admin = require('./Admin');
const main = require('../Config/main');
const Unknow = require('./Unknow');

function commands(sender, msg, client, users, community, allCards, manager) {
  if (main.admins.includes(sender.getSteamID64())) {
    if (
      Admin(sender, msg, client, users, community, allCards, manager) ===
        'UNKNOW' &&
      User(sender, msg, client, users, community, allCards, manager) ===
        'UNKNOW'
    ) {
      Unknow(sender, client, users);
    }
  } else if (
    User(sender, msg, client, users, community, allCards, manager) === 'UNKNOW'
  ) {
    Unknow(sender, client, users);
  }
}
module.exports = commands;
