# Steam-levelup-BOT
This is an advanced cardsets/levelup bot script.

## Requirements:
- Steam account without limitations. Check <a href='https://support.steampowered.com/kb_article.php?ref=3330-iagk-7663'>steam support</a> to see your account status 
- Steam Desktop authentication
- Node.js v9.2.0 or higher 
- Steam Api Key
- Steam Group
- SteamLadder Api Key

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
- Limit the amount of keys bot will trade, large amounts means slow processing due to steam servers
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
- Perfectly parse any gems on inventories, even divided ones
### Leftovers 
- Bot has the ability to detect unset cards, and to handle them, a card is unset when there is extra cards that aren't able to complete another set.
### STM Support 
- If you supply yourself, or if you have a 1:1 bot, setup this script to periodically request a desired amount of sets
### Handle donations 
- You can enable/disable donates on your bot
### BBCodes 
- Some commands like !commands and !admin was builded to show in a stylized bbcode
### Booster Packs 
- Easy Manage your booster packs, or just open them by using admin commands
### Trade Messages 
- Every trade will have a message containing the currencies and sets that will be exchange

## Commands: !help
- <code>!EN</code> - Change the bot's language to english. 
- <code>!PT</code> - Change the bot's language to portuguese. 
- <code>!RU</code> - Change the bot's language to russian. 
- <code>!ES</code> - Change the bot's language to spanish. 
- <code>!CN</code> - Change the bot's language to chinese. 
- <code>!TUTORIAL</code> - Shows the video tutorial. 
- <code>!GIVEAWAY</code> - Get info about giveaway and your entries. 
- <code>!SETS4SETS (amount_of_sets)</code> - Trade your duplicate sets for new ones you can craft. 
- <code>!PRICES</code> - Shows our current rates. 
- <code>!STOCK</code> - Shows currencies stock of the bot. 
- <code>!REPORT (desired_message)</code> - Use to send messages directly to my owner. 
- <code>!RANK</code> - Shows your steam level rank (World / Region / Country). 
- <code>!LEVEL (your_dream_level)</code> - Will check how many Cardsets you need to reach desired level. 
- <code>!KEYLIST</code> - Shows all tradable Keys. 
- <code>!OWNER</code> - Shows owner account. 
- <code>!INVITE</code> - Sends you an invite to our Steamgroup. 
- <code>!CHECK</code> - Checks how many sets you can buy. 
- <code>!CHECKONE</code> - Checks how many individual sets you can buy.  
### CSGO Section. 
- <code>!CHECKCSGO (amount_of_keys)</code> - Shows how many sets and what level you would reach for a specific amount of keys. 
- <code>!BUYCSGO (amount_of_keys)</code> - Buy uncrafted Cardsets for a specific amount of CS:GO Keys. 
- <code>!BUYANYCSGO (amount_of_keys)</code> - Buy any Cardsets for a specific amount of CS:GO Keys. 
- <code>!BUYONECSGO (amount_of_keys)</code> - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate.  
### Hydra Section. 
- <code>!CHECKHYDRA (amount_of_keys)</code> - Shows how many sets and what level you would reach for a specific amount of HYDRA keys. 
- <code>!BUYHYDRA (amount_of_keys)</code> - Buy uncrafted Cardsets for a specific amount of HYDRA Keys. 
- <code>!BUYANYHYDRA (amount_of_keys)</code> - Buy any Cardsets for a specific amount of HYDRA Keys. 
- <code>!BUYONEHYDRA (amount_of_keys)</code> - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate.  
### TF2 Section. 
- <code>!CHECKTF (amount_of_keys)</code> - Shows how many sets and what level you would reach for a specific amount of tf2 keys. 
- <code>!BUYTF (amount_of_keys)</code> - Buy uncrafted Cardsets for a specific amount of TF2 Keys. 
- <code>!BUYANYTF (amount_of_keys)</code> - Buy any Cardsets for a specific amount of TF2 Keys. 
- <code>!BUYONETF (amount_of_keys)</code> - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate.  
### GEMS Section. 
- <code>!CHECKGEMS (amount_of_gems)</code> - Shows how many sets and what level you would reach for a specific amount of gems. 
- <code>!BUYGEMS (amount_of_sets)</code> - Buy a specific amount of uncrafted Cardsets for GEMS. 
- <code>!BUYANYGEMS (amount_of_sets)</code> - Buy a specific amount of amount of Cardsets per gems. 
- <code>!BUYONEGEMS (amount_of_sets)</code> - Use this if you are a badge collector. BOT will send only one set of each game, following the current BOT rate. 
### Suppliers Section. 
- <code>!SELLCHECK</code> - Checks for Sets the Bot can buy from you. 
- <code>!SELLCSGO (amount_of_keys)</code> - Sell Cardsets and get a specific amount of CS:GO Keys. 
- <code>!SELLTF (amount_of_keys)</code> - Sell Cardsets and get a specific amount of TF2 Keys. 
- <code>!SELLHYDRA (amount_of_keys)</code> - Sell Cardsets and get a specific amount of HYDRA Keys. 
- <code>!SELLGEMS (amount_of_sets)</code> - Sell a specific amount of Cardsets and get GEMS.

## Admin Commands: !admin
- <code>!WITHDRAWCSGO (amount_of_keys)</code> - Withdraw a specific amount of CS:GO keys. 
- <code>!WITHDRAWHYDRA (amount_of_keys)</code> - Withdraw a specific amount of HYDRA keys. 
- <code>!WITHDRAWTF (amount_of_keys)</code> - Withdraw a specific amount of TF2 keys. 
- <code>!WITHDRAWGEMS (amount_of_gems)</code> - Withdraw a specific amount of GEMS. 
- <code>!WITHDRAWSETS (amount_of_sets)</code> - Withdraw a specific amount of SETS. 
- <code>!WITHDRAWBOOSTER (amount_of_booster)</code> - Withdraw a specific amount of BOOSTER. 
- <code>!WITHDRAWLEFTOVER</code> - Remove leftovers. 
- <code>!DEPOSITCSGO (amount_of_keys)</code> - Deposits a specific amount of CS:GO keys. 
- <code>!DEPOSITHYDRA (amount_of_keys)</code> - Deposits a specific amount of HYDRA keys. 
- <code>!DEPOSITTF (amount_of_keys)</code> - Deposits a specific amount of TF2 keys amount. 
- <code>!DEPOSITGEMS (amount_of_gems)</code> - Deposits a specific amount of GEMS. 
- <code>!DEPOSITSETS (amount_of_sets)</code> - Deposits a specific amount of SETS. 
- <code>!DEPOSITBOOSTER (amount_of_booster)</code> - Deposits a specific quantity of BOOSTER. 
- <code>!RESTOCK</code> - Sends a trade offer to the owner requesting that all available sets be traded. 
- <code>!SETS4SETS (amount_of_sets)</code> - Trade your duplicate sets for new ones you can craft. 
- <code>!USERCHECK (ID64)</code> - Verify User. 
- <code>!BLOCK (ID64)</code> - Block user. 
- <code>!UNBLOCK (ID64)</code> - Unlock user. 
- <code>!RELOAD</code> - Reload Inventory. 
- <code>!RAFFLE</code> - Choose the winner of the raffle. 
- <code>!REQUESTER</code> - Forces the automatic request to be triggered. 
- <code>!PROFIT</code> - Shows bot transactions this month. 
- <code>!AUTHCODE</code> - Shows auth code. 
- <code>!BROADCAST (message)</code> - Send a message to all friends in the friends list. 
- <code>!UNPACK</code> - Unpack all boosters. 
- <code>!DIE</code> - Turn off the bot. 
- <code>!RESTART</code> - Restart the bot.
