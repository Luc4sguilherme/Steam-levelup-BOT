function relationShip(client, id64, callback) {
  let relation = '';

  switch (client.myFriends[id64]) {
    case 3:
      relation = 'FRIEND';
      break;
    case 5:
      relation = 'BANNED';
      break;
    default:
      relation = 'NOTAFRIEND';
  }

  callback(relation);
}

module.exports = relationShip;
