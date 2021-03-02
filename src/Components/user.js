/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const log = require('./log');
const main = require('../Config/main');
const messages = require('../Config/messages');
const chatMessage = require('./message');
const { getDefaultLanguage } = require('../Utils');

const read = () => {
  let users = {};
  if (!fs.existsSync('./Data/User/Users.json')) {
    fs.writeFile(
      './Data/User/Users.json',
      JSON.stringify(users),
      {
        flags: 'w',
      },
      (ERR) => {
        if (ERR) {
          log.error(`An error occurred while writing UserData file: ${ERR}`);
        }
      }
    );
  } else {
    try {
      users = JSON.parse(fs.readFileSync('./Data/User/Users.json'));
    } catch (error) {
      log.error(`An error occurred while getting UserData file: ${error}`);
    }
  }
  return users;
};

const inactive = (client, users) => {
  const listUsers = users;
  function addUsers(obj, prop) {
    const user = obj;
    for (const p of prop) {
      user[p] = {};
      user[p].idleforhours = 0;
      user[p].language = getDefaultLanguage();
    }
  }

  function deleteUsers(obj, prop) {
    const user = obj;
    for (const p of prop) {
      if (p in user) delete user[p];
    }
  }
  setInterval(() => {
    const c = [];
    const a = [];
    for (let i = 0; i < Object.keys(client.myFriends).length; i += 1) {
      if (
        Object.prototype.hasOwnProperty.call(
          listUsers,
          Object.keys(client.myFriends)[i]
        ) === false
      ) {
        a.push(Object.keys(client.myFriends)[i]);
      }
    }
    if (a.length > 0) {
      addUsers(listUsers, a);
    }
    for (let i = 0; i < Object.keys(listUsers).length; i += 1) {
      if (
        client.myFriends[Object.keys(listUsers)[i]] === undefined ||
        client.myFriends[Object.keys(listUsers)[i]] === 5
      ) {
        c.push(Object.keys(listUsers)[i]);
      }
      if (
        listUsers[Object.keys(listUsers)[i]].idleforhours >=
          main.maxDaysAdded * 24 &&
        !main.admins.includes(Object.keys(listUsers)[i])
      ) {
        chatMessage(
          client,
          Object.keys(listUsers)[i],
          messages.INACTIVE[listUsers[Object.keys(listUsers)[i]].language]
        );
        client.removeFriend(Object.keys(listUsers)[i]);
        c.push(Object.keys(listUsers)[i]);
      } else {
        listUsers[Object.keys(listUsers)[i]].idleforhours += 1;
      }
    }
    if (c.length > 0) {
      deleteUsers(listUsers, c);
    }
    fs.writeFile('./Data/User/Users.json', JSON.stringify(listUsers), (ERR) => {
      if (ERR) {
        log.error(`An error occurred while writing UserData file: ${ERR}`);
      }
    });
  }, 1000 * 60 * 60);
};

const spam = (client, users, userMsgs) => {
  for (let i = 0; i < Object.keys(userMsgs).length; i += 1) {
    if (userMsgs[Object.keys(userMsgs)[i]] === main.maxMsgPerSec) {
      chatMessage(
        client,
        Object.keys(userMsgs)[i],
        messages.SPAM[0][users[Object.keys(userMsgs)[i]].language]
      );
    } else if (userMsgs[Object.keys(userMsgs)[i]] > main.maxMsgPerSec) {
      chatMessage(
        client,
        Object.keys(userMsgs)[i],
        messages.SPAM[1][users[Object.keys(userMsgs)[i]].language]
      );
      client.removeFriend(Object.keys(userMsgs)[i]);
      for (let j = 0; j < main.admins.length; j += 1) {
        chatMessage(
          client,
          main.admins[j],
          messages.SPAM[2][users[main.admins[j]].language].replace(
            '{STEAMID64}',
            Object.keys(userMsgs)[i]
          )
        );
      }
    }
  }

  return {};
};

module.exports = {
  inactive,
  read,
  spam,
};
