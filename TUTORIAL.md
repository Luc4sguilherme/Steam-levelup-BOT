# Linux (ubuntu)
## 1° Update ubuntu
<pre>
  sudo apt update && sudo apt upgrade
</pre>

## 2° Install Node.js
<pre>
  curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

  sudo apt-get install -y nodejs
</pre>

## 3° Download Bot files
<pre>
  git clone https://github.com/Luc4sguilherme/Steam-levelup-BOT.git 
</pre>

## 4° Install dependencies
<pre>
  cd Steam-levelup-BOT

  npm install --production --force
</pre>

## 5° Getting your <code>shared_secret</code> & <code>identity_secret</code>:
 - Read for information: <a href=https://steamcommunity.com/groups/TradeVise/discussions/2/1621724915764974831>Link</a>
 - <code>DO NOT SHARE YOUR CODES WITH ANYONE!!!  These codes serve as your mobile authenticator, if someone that knows what they are doing gets a hold of these codes they could effectively take control of your account! Keep these codes completely private!</code>  

## 6° Create Steam Api Key
<pre>
  <a href=https://steamcommunity.com/dev/apikey>https://steamcommunity.com/dev/apikey</a>
</pre>

## 7° Create Steamladder Api Key
<pre>
  <a href=https://steamladder.com/user/settings/api>https://steamladder.com/user/settings/api</a>
</pre>

## 8° Setting the bot

- <code>cd src/Config</code>

- <code>mv main.example.js main.js</code>

- <code>vim main.js</code>

- Press the key <code>i</code>

- Fill in all empty fields

- Press the key <code>ESC</code>

- Type in keyboard <code>:wq</code>

- Press <code>Enter</code>

## 9° Starting
<pre>
  cd ~/Steam-levelup-BOT

  nohup npm start > log.txt 2> err.txt &
</pre>

## 10° Logs monitoring
<pre>
  tail -f log.txt

  tail -f err.txt
</pre>

</br>

# Windows 10
## 1° Install Node.js
<pre>
  <a href=https://nodejs.org/dist/v14.17.4/node-v14.17.4-x64.msi>https://nodejs.org/dist/v14.17.4/node-v14.17.4-x64.msi</a>
</pre>

## 2° Download Bot files
 <pre><a href=https://github.com/Luc4sguilherme/Steam-levelup-BOT/archive/master.zip>https://github.com/Luc4sguilherme/Steam-levelup-BOT/archive/master.zip</a></pre>

## 3° Install dependencies
  - Unzip
  - run <code>install</code> file

## 4° Install Steam Desktop Authenticator
<pre>
  <a href=https://github.com/Jessecar96/SteamDesktopAuthenticator/archive/master.zip>https://github.com/Jessecar96/SteamDesktopAuthenticator/archive/master.zip</a>
</pre>

## 5° Setting Steam Desktop Authenticator
  - Click in <code>Setup New Account</code> Button
  - Fill in the fields with the bot's steam account information

## 6° Getting your <code>shared_secret</code> & <code>identity_secret</code>:
  - Go to the <code>SDA (Steam Desktop Authenticator)</code> directory. If you have encryption disabled go to step 3.
  - Open SDA and hit "Manage Encryption". Fill in your encryption key and when asked to create a new one leave the text box blank. This will disable encryption.
  - Head over to the <code>maFiles</code> folder and open the file named after your accounts <code>SteamID64</code>.
  - Search the file for <code>shared_secret:"XXXXXXXXXXXXXX="</code>, instead of XXX it should have a code there, it always ends with =
  - Do the same for <code>identity_secret</code>, it will look similar.
  - <code>DO NOT SHARE YOUR CODES WITH ANYONE!!!  These codes serve as your mobile authenticator, if someone that knows what they are doing gets a hold of these codes they could effectively take control of your account! Keep these codes completely private!</code> 

## 7° Create Steam Api Key
<pre>
  <a href=https://steamcommunity.com/dev/apikey>https://steamcommunity.com/dev/apikey</a>
</pre>

## 8° Create Steamladder Api Key
<pre>
  <a href=https://steamladder.com/user/settings/api>https://steamladder.com/user/settings/api</a>
</pre>

## 9° Setting the bot
  - Navigate to <code>src/Config</code>
  - Rename the <code>main.example.js</code> file to <code>main.js</code>
  - Open the <code>main.js</code> file
  - Fill in all empty fields
  

## 10° Starting
  - run <code>start</code> file
