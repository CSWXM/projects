const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();
const app = require('../../backend/src/app');

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
    express()
      .use('/v0', createProxyMiddleware({ 
        target: 'http://localhost:3010/',
        changeOrigin: true}))
      .use('/static', express.static(
        path.join(__dirname, '..', '..', 'frontend', 'build', 'static')))
      .get('*', function(req, res) {
        res.sendFile('index.html', 
            {root:  path.join(__dirname, '..', '..', 'frontend', 'build')})
      })
  );
  frontend.listen(3020, () => {
    console.log('Frontend Running at http://localhost:3020');
  });
});

afterAll((done) => {
  backend.close(() => { 
    frontend.close(done);
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--headless',
    ],
  });
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});

test('Go to page', async () => {
  await page.goto('http://localhost:3020');
  await page.click('aria/Login');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("CSE186 Email Reader Login")',
  );
  // const welcomeHeading = await page.$('aria/welcome');
  // console.log(await (await welcomeHeading.getProperty('outerHTML')).jsonValue());
  await page.type('[aria-label=email]', 'molly@books.com');
  await page.type('[aria-label=password]', 'mollymember');
  await page.click('aria/submit');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("CSE186 Email Reader Home")',
  );

  // const homeroot = (await page.$('aria/homeroot'));
  // console.log(await (await homeroot.getProperty('outerHTML')).jsonValue());

  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Public-key system-worthy firmware")',
  );

  // const logout = (await page.$('aria/Logout'));
  await page.click('aria/Logout');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Logged Out")',
  );
  await page.click('aria/Login');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("CSE186 Email Reader Login")',
  );

  await page.type('[aria-label=email]', 'anna@books.com');
  await page.type('[aria-label=password]', 'annaadmin');
  await page.click('aria/submit');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("CSE186 Email Reader Home")',
  );
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Horizontal value-added software")',
  );

  await page.click('aria/Logout');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Logged Out")',
  );
  await page.click('aria/Login');

  await page.type('[aria-label=email]', 'anna@books.com');
  await page.type('[aria-label=password]', 'notvalidpwd');
  await page.click('aria/submit');
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Error logging in, please try again")',
  );
});