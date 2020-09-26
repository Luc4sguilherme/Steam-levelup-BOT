# Steam-levelup-BOT-full
This is an advanced cardsets/levelup bot script, and is most recommended if you already owns a service like this.

## Bot Currencies:
- CS:GO Keys
- Hydra Keys
- TF2 Keys
- Gems

## Features:
### Change Language
- The bot has commands for the user to change the language
### Inventory Smart 
- Bot recognizes what inventory need to be reload in every trade, avoiding extra requests (i.e a !buytf would only reload steam and tf inventory, csgo would be ignored)
### Trade Tracking 
- Never lost track of your bot trades, bot will be warning about every single trade
### Profits Tracking 
- Bot will be registering every single !sell/!buy to you keep track of your profits
### Trade Size Limit
- Limit the amount of keys bot will trade, large amounts means slow processings due to steam servers
### Admins 
- Unlimited admins capacity, you can setup how many admins you want, no matter the size of it
### BotName 
- Change botname, you can setup the script to change the botname in every startup, if needed, to display csgo rates (e.g '#BOT 21:1')
### !level Limit 
- Setup the limit of the !level input to avoid over usage of your machine
### Inactivity 
- Setup the bot to delete every user who has x days of inactivity
### AntiSpam 
- Never worry about spam anymore, bot will delete any spammer who abuses us (delete, not block)
### Admin Trades 
- Accept any trade sent by admin, although is strong recommended to use bot commands instead, to keep track of your trades
### Stock Control
- Perfectly control your stock by limiting the amount of sets of each appid you want the bot to buy in !sell
### Profiles comments
- You can setup an specific comment to be made after a customer completes a trade, and this comments will be limited for each customer to avoid flood on that specific profile
### Detailed Logs
- Keep track of every action of your bot, every single log is registered by day, month and hour
### CS:GO keys
- Hand pick every key you want the bot to handle
### Refuse Groups 
- Setup the bot to refuse any group invite that outcome to your bot
### Group invites 
- Bot will be inviting every customer who completes a trade, grow up your community!
### Perfectly Handle Gems 
- Perfectly parse any gems on inventories, even splited ones
### Leftovers 
- Bot has the hability to detect unseted cards, and to handle them, a card is unseted when there is extra cards that aren't able to complete another set.
### STM Support 
- If you supply yourself, or if you have a 1:1 bot, setup this script to periodicly request a desired amount of sets
### Handle donations 
- You can enable/disable donates on your bot
### BBCodes 
- Some commands like !commands and !admin was builded to show in a stylized bbcode
### Booster Packs 
- Easy Manage your booster packs, or just open them by using admin commands
### Trade Messages 
- Every trade will have a message containg the currencies and sets that will be exchange

## Commands: !help
- !EN - Change bot language to english. 
- !PT - Change bot language to portuguese.
- !RU - Change bot language to russian. 
- !ES - Change bot language to spanish. 
- !CN - Change bot language to chinese.
- !TUTORIAL - Shows the video tutorial
- !GIVEAWAY - Get info about giveaway and your entries
- !SETS4SETS X - Trade your duplicate sets for new ones you can craft
- !PRICES - Shows our current rates
- !REPORT [desired message] = Use to send messages directly to my owner
- !RANK - Shows your steam level rank (World / Region / Country)
- !STOCK - Shows currencies stock of the bot
- !LEVEL X - Will check how many Cardsets you need to reach Level X
- !INVITE - Sends you an invite to our Steamgroup
- !KEYLIST - Shows all tradable Keys
- !OWNER - Shows owner account
- !CHECK - Checks how many sets you can buy
- !CHECKONE - Checks how many individual badges you can buy
### CSGO Section. 
- !CHECKCSGO X - Shows how many sets and what level you would reach for a specific amount of keys
- !BUYCSGO X - Buy uncrafted Cardsets for X CS:GO Keys
- !BUYANYCSGO X - Buy any Cardsets for X CS:GO Keys
- !BUYONECSGO X - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate
### HYDRA Section. 
- !CHECKHYDRA X - Shows how many sets and what level you would reach for a specific amount of HYDRA keys
- !BUYHYDRA X - Buy uncrafted Cardsets for X HYDRA Keys
- !BUYANYHYDRA X - Buy any Cardsets for X HYDRA Keys
- !BUYONEHYDRA X - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate
### TF2 Section. 
- !CHECKTF X - Shows how many sets and what level you would reach for a specific amount of tf2 keys
- !BUYTF X - Buy uncrafted Cardsets for X TF2 Keys
- !BUYANYTF X - Buy any Cardsets for X TF2 Keys
- !BUYONETF X - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate
### GEMS Section. 
- !CHECKGEMS X - Shows how many sets and what level you would reach for a specific amount of gems
- !BUYGEMS X - Buy X uncrafted Cardsets for gems
- !BUYANYGEMS X - Buy X amount of Cardsets per gems
- !BUYONEGEMS X - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate
### Suppliers Section. 
- !SELLCHECK - Checks for Sets the Bot can buy from you
- !SELLCSGO X - Sell Cardsets and get X CS:GO Keys
- !SELLTF X - Sell Cardsets and get X TF2 Keys
- !SELLHYDRA X - Sell Cardsets and get X HYDRA Keys
- !SELLGEMS X - Sell X Cardsets and get gems

## Admin Commands: !admin
- !WITHDRAWCSGO X - Withdraw x csgo keys
- !WITHDRAWHYDRA X - Withdraw x amount of HYDRA keys
- !WITHDRAWTF X - Withdraw x tf2 keys
- !WITHDRAWGEMS X - Withdraw x gems
- !WITHDRAWSETS X - Withdraw x sets
- !WITHDRAWBOOSTER X - Withdraw x amount of BOOSTER
- !WITHDRAWLEFTOVER - Remove leftovers
- !DEPOSITCSGO X - Deposit x csgo keys
- !DEPOSITHYDRA - Deposits x amount of HYDRA keys
- !DEPOSITTF X - Deposit x tf2 keys
- !DEPOSITGEMS X - Deposit x gems
- !DEPOSITSETS X - Deposit x sets
- !DEPOSITBOOSTER X - Deposits x quantity of BOOSTER
- !RESTOCK - Sends a trade offer to the owner requesting that all available sets be traded
- !BLOCK - Block user
- !UNBLOCK - Unblock user
- !RAFFLE - Choose the winner of the raffle
- !REQUESTER - Forces the automatic request to be triggered
- !AUTHCODE - Shows auth code
- !BROADCAST X - Send a message to all friends in the friends list
- !UNPACK - Unpack all boosters
- !PROFIT - show bot buys and sells
- !RELOAD - Reload inventory
- !RESTART - Restart the bot(logoff and login)
- !DIE - Logoff bot and close application
