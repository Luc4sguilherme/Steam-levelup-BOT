const log = require('./log');

const chatMessage = (client, id64, msg) => {
  client.chatMessage(id64, msg);
  log.botChatFullMessages(id64, msg);
};
module.exports = chatMessage;
