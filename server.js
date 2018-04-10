const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();


app.get('/questions', function(req, res){
  res.sendFile(__dirname+'/questions.json')

})
app.get('/scrape', function(req, res){
  //const url ='https://www.careercup.com/page?pid=front-end-software-engineer-interview-questions'
  const URL ='https://www.glassdoor.com/Interview/developer-interview-questions-SRCH_KO0,9.htm'
  const QUESTIONS = [];

  const OPTIONS = {
   url: URL,
   headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
   }
  }

  // The structure of our request call
  // The first parameter is our url
  // The callback function takes 3 paraments, an error,
  // response status code and the html

  request(OPTIONS, (error, response, html) => {
    // First we check to see if there are errors
    if(!error) {
      // Next, we utilize the cheerio lib on the returned
      // html (return jQuery functionality)

      const $ = cheerio.load(html);
      // We define variables to capture

      let logo, question, date;
      // Take unique class or id
      $('.interviewQuestionWrapper').each(function(i, el){
        const data = $(this);
        const logo = data.find('img').attr('data-original');
        const question = data.find('.questionText').text()
        const date = data.find('.cell .alignRt').text();
        const id = data.attr('id').split('_').pop();
        const json = { date: date, id: id, question: question, logo : logo};
        QUESTIONS.push(json)
      })
    }

    // Using the fs library to create json file with data
    // The file will be named questions.json
    fs.writeFile('questions.json', JSON.stringify(QUESTIONS, null, 4),
      (err)=> {
        console.log('File successfully written! - Check /questions.json file');
      }
    );
  })

  res.send('Check your console')
})
app.listen('8081')
console.log('Open http://localhost:8081/scrape');
exports = module.exports = app;
