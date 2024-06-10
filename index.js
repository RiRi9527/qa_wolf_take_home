// // EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
// const { chromium } = require("playwright");

// async function saveHackerNewsArticles() {
//   // launch browser
//   const browser = await chromium.launch({ headless: false });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   // go to Hacker News
//   await page.goto("https://news.ycombinator.com");
// }

// (async () => {
//   await saveHackerNewsArticles();
// })();

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { parse } = require("json2csv"); // Importing the parse function from the json2csv package to handle conversion

async function saveHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // Wait for the page to load and ensure '.athing' elements are present
  await page.waitForSelector(".athing");

  // Extract the titles and URLs of the top 10 articles
  const articles = await page.evaluate(() => {
    const rows = document.querySelectorAll(".athing");
    const topArticles = [];
    rows.forEach((row, index) => {
      if (index < 10) {
        const titleElement = row.querySelector(".titleline > a");
        if (titleElement) {
          const title = titleElement.innerText;
          const url = titleElement.href;
          const id = index + 1;
          topArticles.push({ id, title, url });
        } else {
          console.error("Title element not found for row:", row);
        }
      }
    });
    return topArticles;
  });

  // Log the extracted articles
  console.log("Articles extracted:", articles);

  // Check if articles array is empty
  if (articles.length === 0) {
    console.error(
      "No articles found. Please check the selector and page structure."
    );
    await browser.close();
    return;
  }

  // Convert the articles to CSV
  const csv = parse(articles);

  // Define the path to save the CSV file
  const filePath = path.resolve(__dirname, "hacker_news_top_10.csv");

  // Write the CSV file
  fs.writeFileSync(filePath, csv);

  // Close the browser
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();
