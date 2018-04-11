const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/questions', function(req, res) {
  res.sendFile(__dirname + '/questions.json')

})
app.get('/scrape', function(req, res) {

  //const url ='https://www.careercup.com/page?pid=front-end-software-engineer-interview-questions'
  const QUESTIONS = [];
  const ITEMS_PER_PAGE = 10;
  let reviewCount;
  let pages = 1;
  let count = 1;
  console.log("COUNT", count);

  fs.exists('questions.json', (exists)=> {
    if (!exists) {
      // prevents scraping from running multiple times
      requestPage();
    }
  });


  // The structure of our request call
  // The first parameter is our url
  // The callback function takes 3 paraments, an error,
  // response status code and the html
  function requestPage() {
    let URL = `https://www.glassdoor.com/Interview/developer-interview-questions-SRCH_KO0,9_IP${count}.htm`;
    let OPTIONS = {
      url: URL,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
      }
    }

    request(OPTIONS, (error, response, html) => {
      // First we check to see if there are errors
      if (!error) {
        // Next, we utilize the cheerio lib on the returned
        // html (return jQuery functionality)
        const $ = cheerio.load(html);
        // We define variables to capture
        // Take unique class or id
        // Count how many items
        reviewCount = $('.reviewCount').text();
        pages = Math.ceil(reviewCount / ITEMS_PER_PAGE);

        $('.interviewQuestionWrapper').each(function(i, el) {
          const data = $(this);
          const logo = data.find('img').attr('data-original');
          const question = data.find('.questionText').text().trim();
          const date = data.find('.cell .alignRt').text().trim();
          const id = data.attr('id').split('_').pop();
          const json = {
            date: date,
            id: id,
            question: question,
            logo: logo
          };
          QUESTIONS.indexOf(json) === -1
            ? QUESTIONS.push(json)
            : console.log("This item already exists");
        })

        // Using the fs library to create json file with data
        // The file will be named questions.json
        fs.writeFile('questions.json', JSON.stringify(QUESTIONS, null, 4), (err) => {
          count = count + 1;
          console.log("COUNT", count);
          console.log("PAGES", pages);
          console.log("OPTIONS", OPTIONS)

          if (count !== pages) {
            requestPage()
          }
        });
      }
    })
  }

  res.send('Check your console')
})
app.listen('8081')
console.log('Open http://localhost:8081/scrape');
console.log('Open json @ http://localhost:8081/questions.json');

exports = module.exports = app;
