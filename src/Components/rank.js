const moment = require('moment');
const axios = require('axios');

const main = require('../Config/main.js');

const apiKey = main.steamLadderApiKey;

const get = async (SID) => {
  try {
    const options = {
      method: 'GET',
      baseURL: 'https://steamladder.com/api/v1/',
      url: `profile/${SID}`,
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    };

    const { data } = await axios(options);
    return {
      WORLDWIDEXP: data.ladder_rank.worldwide_xp,
      REGIONXP: data.ladder_rank.region.region_xp,
      COUNTRYXP: data.ladder_rank.country.country_xp,
      LASTUPDATE: data.steam_stats.last_update,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (SID) => {
  try {
    const options = {
      method: 'POST',
      baseURL: 'https://steamladder.com/api/v1/',
      url: `profile/${SID}/`,
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    };

    const { data } = await axios(options);
    return {
      WORLDWIDEXP: data.ladder_rank.worldwide_xp,
      REGIONXP: data.ladder_rank.region.region_xp,
      COUNTRYXP: data.ladder_rank.country.country_xp,
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
