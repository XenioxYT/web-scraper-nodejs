
# Web Scraper README

This is a simple web scraper that uses Puppeteer to scrape web pages with [NordVPN](https://nordvpn.com/) for added security. The scraper is built as a Node.js server with an Express endpoint, ready to receive POST requests from a Python client to scrape web pages and return the inner text as JSON.

## Features

- Uses a NordVPN connection for secure browsing
- Takes an input URL to scrape the content of a webpage
- Fetches the page content as inner text
- Runs as an Express server and exposes an API endpoint

## Dependencies

- [Node.js](https://nodejs.org/)
- [Express](https://www.npmjs.com/package/express)
- [Puppeteer](https://www.npmjs.com/package/puppeteer)

## Installation

1. Install Node.js on your system: https://nodejs.org/en/download/

2. Install the required packages:

```bash
npm install express puppeteer
```

3. Update the following variables in the script with your NordVPN credentials and corresponding proxy server:

```javascript
let conf = {
    vpnUser: '',  //replace with your NordVPN username
    vpnPass: '',  //replace with your NordVPN password
    vpnServer: 'https://uk1785.nordvpn.com:89',  // replace with correct proxy details from NordVPN
};
```

4. Save the script as `web_scraper_server.js`.

5. Run the server:

```bash
node web_scraper_server.js
```

The server will be running at `http://localhost:3000`.

## Usage

When prompted in a Discord channel, the Python client will send a POST request to the server's `/scrape` endpoint with the target URL. The server will input this URL into Puppeteer to browse the page through a NordVPN proxy, scrape the content of the page as raw text, and return the text as a JSON object. The Python client will then parse the received JSON and incorporate it into the user's reply as needed.
