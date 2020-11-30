const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const args = `"https://cdn.steam.tools/data/set_data.json" -H "authority: cdn.steam.tools" -H "pragma: no-cache" -H "cache-control: no-cache" -H "accept: application/json, text/plain, */*" -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" -H "origin: https://steam.tools" -H "sec-fetch-site: same-site" -H "sec-fetch-mode: cors" -H "sec-fetch-dest: empty" -H "referer: https://steam.tools/" -H "accept-language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,da;q=0.6,ru;q=0.5"`;

exec(`curl ${args}`, { maxBuffer: 1024 * 1024 * 5 }, function (error, stdout) {
  if (error) {
    console.log(`exec error: ${error}`);
  } else {
    fs.writeFileSync(
      path.resolve(__dirname, '..', '..', 'DATA', 'SETS', 'set_data.json'),
      stdout
    );
  }
});
