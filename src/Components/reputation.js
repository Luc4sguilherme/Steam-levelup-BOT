const utils = require('../Utils');

async function reputation(id64) {
  try {
    const rep = await utils.getRep(id64);

    const infos = {
      summary: '',
      tags: '',
      vacban: '',
      tradeban: '',
    };

    switch (rep.steamrep.reputation.summary) {
      case 'SCAMMER':
        infos.summary = 'SCAMMER';
        break;
      case 'Caution':
        infos.summary = 'CAUTION';
        break;
      case 'Admin':
        infos.summary = 'ADMIN';
        break;
      case 'Middleman':
        infos.summary = 'MIDDLEMAN';
        break;
      case 'Trusted Seller':
        infos.summary = 'TRUSTEDSELLER';
        break;
      case 'none':
        infos.summary = 'NONE';
        break;
      default:
        infos.summary = 'UNKNOWN';
    }
    if (rep.steamrep.reputation.tags) {
      switch (rep.steamrep.reputation.tags.tag.category) {
        case 'evil':
          infos.tags = 'EVIL';
          break;
        case 'trusted':
          infos.tags = 'TRUSTED';
          break;
        case 'misc':
          infos.tags = 'MISC';
          break;
        default:
          infos.tags = 'UNKNOWN';
      }
    }
    if (rep.steamrep.vacban === 1) {
      infos.vacban = 'VACBAN';
    }
    if (rep.steamrep.tradeban === 2) {
      infos.tradeban = 'TRADEBAN';
    }

    return infos;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = reputation;
