const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });  

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('all descendant divs within span', () => {
  it('should should have orange text', async () => {
    const colors = await page.$$eval('span div', (divs) => {
      let colors = [];
      for(let i = 0; i < divs.length; i++){
        let style = window.getComputedStyle(divs[i]);
        colors.push(style.getPropertyValue('color'));
      }
      return colors;
    });

    expect(colors.length).toBe(3)
    
    expect(colors[0]).toBe('rgb(255, 165, 0)');
    expect(colors[1]).toBe('rgb(255, 165, 0)');
    expect(colors[2]).toBe('rgb(255, 165, 0)');
  });
});

describe('all children divs of span', () => {
  it('should should have large text', async () => {
    const fontSizes = await page.$$eval('span > div', (divs) => {
      let fontSizes = [];
      for(let i = 0; i < divs.length; i++){
        let style = window.getComputedStyle(divs[i]);
        fontSizes.push(style.getPropertyValue('font-size'));
      }
      return fontSizes;
    });
      
    expect(fontSizes.length).toBe(2);
      
    expect(fontSizes[0]).toBe('18px');
    expect(fontSizes[1]).toBe('18px');
  });
});

describe('all adjacent sibling divs of span', () => {
  it('should should have red text', async () => {
    const colors = await page.$$eval('span + div', (divs) => {
      let colors = [];
      for(let i = 0; i < divs.length; i++){
        let style = window.getComputedStyle(divs[i]);
        colors.push(style.getPropertyValue('color'));
      }
      return colors
    });

    expect(colors.length).toBe(1);
      
    expect(colors[0]).toBe('rgb(255, 0, 0)');
  });
});

describe('all sibling divs of span', () => {
  it('should should a yellow background', async () => {
    const backgroundColors = await page.$$eval('span ~ div', (divs) => {
      let backgroundColors = [];
      for(let i = 0; i < divs.length; i++){
        let style = window.getComputedStyle(divs[i]);
        backgroundColors.push(style.getPropertyValue('background-color'));
      }
      return backgroundColors;
    });
      
    expect(backgroundColors.length).toBe(2)

    expect(backgroundColors[0]).toBe('rgb(255, 255, 0)');
    expect(backgroundColors[1]).toBe('rgb(255, 255, 0)');
  });
});
