const fs = require('fs');
const log = require('./log');
const main = require('../Config/main');
const messages = require('../Config/messages');
const chatMessage = require('./message');

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
  setInterval(() => {
    const c = [];
    const a = [];
    for (let i = 0; i < Object.keys(client.myFriends).length; i += 1) {
      if (users.hasOwnProperty(Object.keys(client.myFriends)[i]) === false) {
        a.push(Object.keys(client.myFriends)[i]);
      }
    }
    if (a.length > 0) {
      function addUsers(obj, prop) {
        for (const p of prop) {
          (obj[p] = {}), (obj[p].idleforhours = 0), (obj[p].language = 'EN');
        }
      }
      addUsers(users, a);
    }
    for (let i = 0; i < Object.keys(users).length; i += 1) {
      if (
        client.myFriends[Object.keys(users)[i]] === undefined ||
        client.myFriends[Object.keys(users)[i]] === 5
      ) {
        c.push(Object.keys(users)[i]);
      }
      if (users[Object.keys(users)[i]].idleforhours >= main.maxDaysAdded * 24) {
        chatMessage(
          client,
          Object.keys(users)[i],
          messages.INACTIVE[users[Object.keys(users)[i]].language]
        );
        client.removeFriend(Object.keys(users)[i]);
        c.push(Object.keys(users)[i]);
      } else {
        users[Object.keys(users)[i]].idleforhours += 1;
      }
    }
    if (c.length > 0) {
      function deleteUsers(obj, prop) {
        for (const p of prop) {
          p in obj && delete obj[p];
        }
      }
      deleteUsers(users, c);
    }
    fs.writeFile('./Data/User/Users.json', JSON.stringify(users), (ERR) => {
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
          messages.SPAM[2][users[Object.keys(userMsgs)[i]].language].replace(
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
