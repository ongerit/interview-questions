const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();
const accesslog = require('access-log');

app.get('/scrape', function(req, res){

  //const url ='https://www.careercup.com/page?pid=front-end-software-engineer-interview-questions'
  //const url ='http://thomasongeri.com';
  const url ='https://www.glassdoor.com/Interview/developer-interview-questions-SRCH_KO0,9.htm'

  const options = {
   url: url,
   headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
   }
  }

  // The structure of our request call
  // The first parameter is our url
  // The callback function takes 3 paraments, an error,
  // response status code and the html
  console.log('loading... /scrape');
  request(options, (error, response, html) => {
    // First we check to see if there are errors
    if(!error) {
      // Next, we utilize the cheerio lib on the returned
      // html (return jQuery functionality)

      const $ = cheerio.load(html);
      // We define variables to capture

      let logo, question, date;
      const arr = [];
      // Take unique class or id


      $('.interviewQuestionWrapper').each(function(i, el){
        const data = $(this);
        const logo = data.find('img').attr('data-original');
        const question = data.find('.questionText').text()
        const date = data.find('.cell .alignRt').text();

        const json = { logo : logo, question: question, date: date};
        arr.push(json);
      })
      console.log(arr);


    }


  })

  res.send('check your console')
  accesslog(req,res);
})

app.listen('8081')

//http.createServer((req, res) => {
// accesslog(req,res);
// res.end();
//}).listen(9000,'127.0.0.1');

console.log('Open http://localhost:8081/scrape');

exports = module.exports = app;
