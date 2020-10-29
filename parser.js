const puppeteer = require("puppeteer");
const cherio = require("cheerio");

const SITE_URL = "https://vashidveri72.ru";
const MAIN_DIRECTORY_URL = "/catalog/dveri_vkhodnye/";

async function getTypes(page) {
  await page.goto(SITE_URL + MAIN_DIRECTORY_URL);

  const htmlPage = await page.content();
  const $ = cherio.load(htmlPage);

  const result = [];

  //Получаем все возможные категории входных дверей
  $(".bx_children_block > ul > .parent > a").each((i, a) => {
    const url = $(a).attr("href");
    const category = $(a).text().trim();

    
    if (url.includes("dveri_vkhodnye"))
      result.push({
        url: url,
        category: category,
      });
  });
  return result;
}

async function getTypesData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const types = await getTypes(page);
  const result = [];

  //Для каждой категории парсим стриницу и получаем список данных.
  for (const type of types) {
    const data = await parsePage(page, SITE_URL + type.url);
    const category = {
      category: type.category,
      url: SITE_URL + type.url,
      data: data,
    };
    result.push(category);
  }
  browser.close();
  return result;
}

async function parsePage(page, url) {
  await page.goto(url);

  const htmlPage = await page.content();
  const $ = cherio.load(htmlPage);

  //Получаем имя и URL
  const data = [];
  $(".name_product a").each((i, a) => {
    const url = SITE_URL + $(a).attr("href");
    const name = $(a).text();
    data.push({
      url: url,
      name: name,
    });
  });


  //Получаем цену
  const prices = [];
  $(".price_block .new_price").each((index, element) => {
    const price = $(element).text();
    prices.push(price);
  });

  //Мерджим цены и остальные данные
  return data.map((item, index) => {
    return { ...item, price: prices[index] };
  });
}

module.exports = {
  getTypesData,
};
