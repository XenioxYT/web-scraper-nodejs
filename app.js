// const express = require('express');
// const puppeteer = require('puppeteer');
// const app = express();
// const port = 3000;

// let conf = {
//     vpnUser: '',  //replace with your NordVPN username
//     vpnPass: '',  //replace with your NordVPN password
//     vpnServer: 'https://uk1785.nordvpn.com:89',  // replace with correct proxy details from NordVPN
// };

// let browser;

// app.use(express.json());

// puppeteer.launch({
//     args: [
//         '--disable-dev-shm-usage',
//         `--proxy-server=${conf.vpnServer}`
//     ]
// }).then(brwsr => {
//     browser = brwsr;
// });

const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

let conf = {
    vpnUser: '',  //replace with your NordVPN username
    vpnPass: '',  //replace with your NordVPN password
    vpnServer: 'https://uk1785.nordvpn.com:89',  // replace with correct proxy details from NordVPN
};

let browser;

app.use(express.json());

puppeteer.launch({
    executablePath: '/usr/bin/google-chrome', // Add this line
    args: [
        '--disable-dev-shm-usage',
        `--proxy-server=${conf.vpnServer}`
    ],
    headless: 'new' // Add this line to set headless mode to "new" if needed
}).then(brwsr => {
    browser = brwsr;
});

const parsePage = async url => {
  try {
    const page = await browser.newPage();

    await page.authenticate({
      username: conf.vpnUser,
      password: conf.vpnPass,
    });

    console.log(`Scraping ${url}`)

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    let bodyHTML = await page.evaluate(() => document.body.innerText);

    await page.close();

    console.log(`Scraped ${url}`)
    // print bodyHTML to console but limit to 100 characters so it doesn't spam the console
    console.log(bodyHTML.substring(0, 100));

    return bodyHTML;
  } catch (error) {
    console.error(`Failed to scrape page due to ${error.message}`);
    throw error;
  }
};

app.post('/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const data = await parsePage(url);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: `Failed to scrape URL due to ${error.message}` });
  }
});

process.on('SIGINT', async () => {
  if (browser) await browser.close();
  process.exit();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
