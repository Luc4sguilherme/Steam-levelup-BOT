const request = require('request-promise');

const main = require('../Config/main.js');
const log = require('./log');

const apiKey = main.steamLadderApiKey;

const get = async (SID, callback) => {
  try {
    const baseURL = 'https://steamladder.com/api/v1';
    const options = {
      method: 'GET',
      uri: `${baseURL}/profile/${SID}`,
      json: true,
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    };

    const response = await request(options);
    callback(
      null,
      response.ladder_rank.worldwide_xp,
      response.ladder_rank.region.region_xp,
      response.ladder_rank.country.country_xp
    );
  } catch (error) {
    callback(error);
  }
};

const update = async (SID) => {
  try {
    const baseURL = 'https://steamladder.com/api/v1';
    const options = {
      method: 'POST',
      uri: `${baseURL}/profile/${SID}/`,
      json: true,
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    };

    await request(options);
    log.warn('Rank updated');
  } catch (error) {
    log.error(`An error occurred while updating the rank: ${error}`);
  }
};

module.exports = {
  get,
  update,
};
