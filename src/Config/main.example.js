module.exports = {
  // Bot Steam Username
  userName: '',

  // Bot Steam Password
  passWord: '',

  // Bot Steam ID64
  steamID: '',

  // Bot Shared Secret for your Bot account (SDA)
  sharedSecret: '',

  // Bot Identity Secret for your Bot account (SDA)
  identitySecret: '',

  // Bot Steam API Key
  steamApiKey: '',

  // Steamladder API Key
  steamLadderApiKey: '',

  // Steam.supply support to setup your bot in cardbot catalog list!
  steamSupply: {
    apiKey: '',
    updateCardDB: false,
    updateCatalog: false,
  },

  // You can add multiple Administrators - example [ "SteamID64", "SteamID64" ]
  admins: [''],

  // Owners Profile link
  owner: '',

  // Video tutorial
  tutorial: '',

  // Leave blank to use local computer time
  timeZone: 'America/Sao_Paulo',

  // Set to true if you want bot to accept any donations  (true or false)
  acceptDonations: true,

  // Setup bot to only handle foil cards instead of normal ones, it will also make bot recognize normal cards as leftovers.
  foilMode: false,

  // Setup the commands you want the bot to ignore
  ignoreCommands: [''],

  // Setup the currencies you want the bot to accept
  acceptedCurrency: {
    CSGO: true,
    HYDRA: true,
    TF2: true,
    GEMS: true,
  },

  // Set to true if you want to handle suppliers (!SELL commands).
  handleSuppliers: true,

  steamGroup: {
    // Set to true if you want to invite customers to a desired GroupID64
    doInvites: true,
    // Target Group link
    link: '',
    // Target Group ID64
    ID: '',
    // if you want to auto refuse all group invites, set this to true
    refuseInvites: true,
  },

  // If you want to automatically add rates to the bot name on startups, set to true, false otherwise. (It is necessary to define the botName variable)
  ratesInBotName: {
    status: false,
    currency: 'CSGO',
  },

  // Defines the name of the BOT on initializations.
  botName: '',

  // Set to true if you want to be warned in your steam chat about every sell/buy bot does
  getTradeMessages: true,

  comment: {
    // Set to true if you want the bot to comment on customers profile
    enabled: true,
    // Interval between user profile comments after negotiation. (in hours)
    interval: 24,
  },

  // Max days an customer can be on friend list without interact with bot.
  maxDaysAdded: 180,

  // The amount of messages users can send every second without getting removed.
  maxMsgPerSec: 2,

  // Max amount of sets, of each appid, that bot will try to buy
  maxStock: 15,

  // Max level you can request using !level
  maxLevel: 6666,

  // Max amount of sets that will be allowed in a trade
  maxBuy: 2500,
  maxSell: 1000,

  // Max amount of sets that will be allowed in a trade
  maxSets4Sets: 100,

  // Max amount that will be allowed in check commands
  maxCheck: {
    csgo: 10000,
    gems: 1000000,
    tf: 10000,
    hydra: 10000,
  },

  // Set to true to display logs, although even if this is false, logs will be saved on history folder...
  log: {
    warn: {
      enabled: true,
      color: 'yellowBright',
    },
    error: {
      enabled: true,
      color: 'redBright',
    },
    info: {
      enabled: true,
      color: 'greenBright',
    },
    userChat: {
      enabled: true,
      color: 'whiteBright',
    },
    adminChat: {
      enabled: true,
      color: 'blackBright',
    },
    tradeOffer: {
      enabled: true,
      color: 'blueBright',
    },
  },

  requester: {
    // Max amount of sets each trade will try to request to target
    amount: 100,
    // You can add multiple Target - example [ "SteamID64", "SteamID64" ]
    steamID64: [''],
    // Timer interval of requester in hours
    inverval: 24,
    // Set to true if you want to ignore the "maxStock"
    ignoreLimit: true,
    // True to send our leftovers
    sendLeftOvers: false,
    // True to enable, false to otherwise
    enabled: false,
  },
};
