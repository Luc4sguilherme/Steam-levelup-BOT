const moment = require('moment');
const request = require('request-promise');

const main = require('../Config/main.js');

const apiKey = main.steamLadderApiKey;

const get = async (SID) => {
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
    return {
      WORLDWIDEXP: response.ladder_rank.worldwide_xp,
      REGIONXP: response.ladder_rank.region.region_xp,
      COUNTRYXP: response.ladder_rank.country.country_xp,
      LASTUPDATE: response.steam_stats.last_update,
    };
  } catch (error) {
    throw new Error(error);
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

    const response = await request(options);
    return {
      WORLDWIDEXP: response.ladder_rank.worldwide_xp,
      REGIONXP: response.ladder_rank.region.region_xp,
      COUNTRYXP: response.ladder_rank.country.country_xp,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const rank = (SID) =>
  new Promise((resolve, reject) => {
    get(SID)
      .then((data) => {
        if (moment().isAfter(moment(`${data.LASTUPDATE}Z`).add(4, 'hours'))) {
          resolve(update(SID));
        } else {
          resolve(data);
        }
      })
      .catch(reject);
  });

module.exports = {
  rank,
};
