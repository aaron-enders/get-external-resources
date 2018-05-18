var gulp = require('gulp'),
resources = require('gulp-resources');
var Crawler = require('simplecrawler');
var clean = require('gulp-clean');
newfile           = require('gulp-file');
timestamp           = require('time-stamp');
prompt           = require('gulp-prompt');

fs = require('fs');


var lastUrl = "";
gulp.task('resources', function(cb) {
      var argv = require('yargs').argv;
      var url= argv.url;

      var logfile = "./"+encodeURIComponent(url.replace(/(^\w+:|^)\/\//, ''))+"-"+timestamp("YYYY-MM-DD-mm-ss")+".csv";
      fs.writeFile(logfile, '', cb);
      fs.appendFile(logfile, "HOST;URL;TYPE;REF LASTURL;REF\r\n", function (err) { if (err) throw err; });
      var crawler = Crawler(url);
      const cheerio = require('cheerio')
      crawler.interval=10;
      crawler.parseHTMLComments=false;
      crawler.filterByDomain=false;
      crawler.timeout=100000;
<<<<<<< HEAD
      crawler.maxResourceSize=5777216;
=======
>>>>>>> 879e7efc4a860e9dd5d25734e1b553d6995c3217
      crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
          callback(null, referrerQueueItem.host === crawler.host);
      });
      crawler.on("invaliddomain", function(queueItem, responseBuffer, response) {
        console.log("(Invalid Domain)");
      });
      crawler.on("fetchcomplete",function(queueItem, responseBuffer, response) {
<<<<<<< HEAD
        if (queueItem.stateData.contentType){
          var type = queueItem.stateData.contentType.replace("; charset=utf-8", "").replace("charset=UTF-8", "");
        }else{
          var type = "(undefined)";
        }

=======
        var type = queueItem.stateData.contentType.replace("; charset=utf-8", "");
>>>>>>> 879e7efc4a860e9dd5d25734e1b553d6995c3217
        if (queueItem.url.indexOf(url) !== -1){
          console.log('\x1b[36m%s\x1b[0m', "Internal: ", queueItem.url);
        }else{

          fs.readFile(logfile, function (err, data) {
            if (err) throw err;
            if(data.indexOf(queueItem.url) >= 0){
              console.log('\x1b[32m', "External, already found: ", queueItem.url+" Type: ", type);
            }else{
              console.log('\x1b[32m', "External: ", queueItem.url+" Type: ", type);
<<<<<<< HEAD
              if (type == "text/html"){
                // console.log(queueItem);
              }
              fs.appendFile(logfile, queueItem.host+";"+queueItem.url+";"+type+";"+lastUrl+";"+queueItem.referrer+";"+"\r\n", function (err) {
=======
              var filetype= "unbekannt";
              if (type == "text/html"){
                // console.log(queueItem);
              }
              fs.appendFile(logfile, queueItem.host+";"+queueItem.url+";"+type+";"+lastUrl+queueItem.referrer+";"+"\r\n", function (err) {
>>>>>>> 879e7efc4a860e9dd5d25734e1b553d6995c3217
                  if (err) throw err;
              });
           }
          });
        }
        if(queueItem.url.indexOf("charset=utf-8") >= 0
        || queueItem.url.indexOf("encoding=utf-8") >= 0
        || queueItem.url.indexOf("charset=UTF-8") >= 0){
        }else{
          lastUrl = queueItem.url;
        }
      });
      crawler.on("complete", function(queueItem, responseBuffer, response) {
<<<<<<< HEAD
         console.log('\x1b[35m', "Saved results to "+logfile);
=======
         console.log('\x1b[45m', "Saved results to "+logfile);
>>>>>>> 879e7efc4a860e9dd5d25734e1b553d6995c3217

      });
      crawler.start();
});
