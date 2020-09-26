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
- !EN - Change the bot's language to english. 
- !PT - Change the bot's language to portuguese. 
- !RU - Change the bot's language to russian. 
- !ES - Change the bot's language to spanish. 
- !CN - Change the bot's language to chinese. 
- !TUTORIAL - Shows the video tutorial. 
- !GIVEAWAY - Get info about giveaway and your entries. 
- !SETS4SETS (amount_of_sets) - Trade your duplicate sets for new ones you can craft. 
- !PRICES - Shows our current rates. 
- !STOCK - Shows currencies stock of the bot. 
- !REPORT (desired_message) - Use to send messages directly to my owner. 
- !RANK - Shows your steam level rank (World / Region / Country). 
- !LEVEL (your_dream_level) - Will check how many Cardsets you need to reach desired level. 
- !KEYLIST - Shows all tradable Keys. 
- !OWNER - Shows owner account. 
- !INVITE - Sends you an invite to our Steamgroup. 
- !CHECK - Checks how many sets you can buy. 
- !CHECKONE - Checks how many individual sets you can buy.  
### CSGO Section. 
- !CHECKCSGO (amount_of_keys) - Shows how many sets and what level you would reach for a specific amount of keys. 
- !BUYCSGO (amount_of_keys) - Buy uncrafted Cardsets for a specific amount of CS:GO Keys. 
- !BUYANYCSGO (amount_of_keys) - Buy any Cardsets for a specific amount of CS:GO Keys. 
- !BUYONECSGO (amount_of_keys) - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate.  
### Hydra Section. 
- !CHECKHYDRA (amount_of_keys) - Shows how many sets and what level you would reach for a specific amount of HYDRA keys. 
- !BUYHYDRA (amount_of_keys) - Buy uncrafted Cardsets for a specific amount of HYDRA Keys. 
- !BUYANYHYDRA (amount_of_keys) - Buy any Cardsets for a specific amount of HYDRA Keys. 
- !BUYONEHYDRA (amount_of_keys) - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate.  
### TF2 Section. 
- !CHECKTF (amount_of_keys) - Shows how many sets and what level you would reach for a specific amount of tf2 keys. 
- !BUYTF (amount_of_keys) - Buy uncrafted Cardsets for a specific amount of TF2 Keys. 
- !BUYANYTF (amount_of_keys) - Buy any Cardsets for a specific amount of TF2 Keys. 
- !BUYONETF (amount_of_keys) - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate.  
### GEMS Section. 
- !CHECKGEMS (amount_of_gems) - Shows how many sets and what level you would reach for a specific amount of gems. 
- !BUYGEMS (amount_of_sets) - Buy a specific amount of uncrafted Cardsets for GEMS. 
- !BUYANYGEMS (amount_of_sets) - Buy a specific amount of amount of Cardsets per gems. 
- !BUYONEGEMS (amount_of_sets) - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate. 
### Suppliers Section. 
- !SELLCHECK - Checks for Sets the Bot can buy from you. 
- !SELLCSGO (amount_of_keys) - Sell Cardsets and get a specific amount of CS:GO Keys. 
- !SELLTF (amount_of_keys) - Sell Cardsets and get a specific amount of TF2 Keys. 
- !SELLHYDRA (amount_of_keys) - Sell Cardsets and get a specific amount of HYDRA Keys. 
- !SELLGEMS (amount_of_sets) - Sell a specific amount of Cardsets and get GEMS.

## Admin Commands: !admin
- !WITHDRAWCSGO (amount_of_keys) - Withdraw a specific amount of CS:GO keys. 
- !WITHDRAWHYDRA (amount_of_keys) - Withdraw a specific amount of HYDRA keys. 
- !WITHDRAWTF (amount_of_keys) - Withdraw a specific amount of TF2 keys. 
- !WITHDRAWGEMS (amount_of_gems) - Withdraw a specific amount of GEMS. 
- !WITHDRAWSETS (amount_of_sets) - Withdraw a specific amount of SETS. 
- !WITHDRAWBOOSTER (amount_of_booster) - Withdraw a specific amount of BOOSTER. 
- !WITHDRAWLEFTOVER - Remove leftovers. 
- !DEPOSITCSGO (amount_of_keys) - Deposits a specific amount of CS:GO keys. 
- !DEPOSITHYDRA (amount_of_keys) - Deposits a specific amount of HYDRA keys. 
- !DEPOSITTF (amount_of_keys) - Deposits a specific amount of TF2 keys amount. 
- !DEPOSITGEMS (amount_of_gems) - Deposits a specific amount of GEMS. 
- !DEPOSITSETS (amount_of_sets) - Deposits a specific amount of SETS. 
- !DEPOSITBOOSTER (amount_of_booster) - Deposits a specific quantity of BOOSTER. 
- !RESTOCK - Sends a trade offer to the owner requesting that all available sets be traded. 
- !SETS4SETS (amount_of_sets) - Trade your duplicate sets for new ones you can craft. 
- !USERCHECK (ID64) - Verify User. 
- !BLOCK (ID64) - Block user. 
- !UNBLOCK (ID64) - Unlock user. 
- !RELOAD - Reload Inventory. 
- !RAFFLE - Choose the winner of the raffle. 
- !REQUESTER - Forces the automatic request to be triggered. 
- !PROFIT - Shows bot transactions this month. 
- !AUTHCODE - Shows auth code. 
- !BROADCAST (message) - Send a message to all friends in the friends list. 
- !UNPACK - Unpack all boosters. 
- !DIE - Turn off the bot. 
- !RESTART - Restart the bot.
