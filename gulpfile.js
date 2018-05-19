var gulp = require('gulp');
var resources = require('gulp-resources');
var Crawler = require('simplecrawler');
var clean = require('gulp-clean');
var newfile           = require('gulp-file');
var timestamp           = require('time-stamp');
var prompt           = require('gulp-prompt');
var fs = require('fs');
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
      crawler.maxResourceSize=5777216;
      crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
          callback(null, referrerQueueItem.host === crawler.host);
      });
      crawler.on("invaliddomain", function(queueItem, responseBuffer, response) {
        console.log("(Invalid Domain)");
      });
      crawler.on("fetchcomplete",function(queueItem, responseBuffer, response) {
        if (queueItem.stateData.contentType){
          var type = queueItem.stateData.contentType.split(';')[0];
        }else{
          var type = "(undefined)";
        }
        if (queueItem.url.indexOf(url) !== -1){
          console.log('\x1b[36m%s\x1b[0m', "Internal: ", queueItem.url);
        }else{

          fs.readFile(logfile, function (err, data) {
            if (err) throw err;
            if(data.indexOf(queueItem.url) >= 0){
              console.log('\x1b[33m', "External: ", "("+type+") "+queueItem.url);
            }else{
              console.log('\x1b[32m', "External: ", "("+type+") "+queueItem.url);
              var filetype= "unbekannt";
              if (type == "text/html"){
                // console.log(queueItem);
              }
              fs.appendFile(logfile, queueItem.host+";"+queueItem.url+";"+type+";"+lastUrl+";"+queueItem.referrer+""+"\r\n", function (err) {
                  if (err) throw err;
              });
            }
          });
        }
        if(queueItem.url.indexOf("charset=utf-8") >= 0
        || queueItem.url.indexOf("encoding=utf-8") >= 0
        || queueItem.url.indexOf("charset=UTF-8") >= 0
        || queueItem.url.indexOf("charset=UTF-8") >= 0){
        }else{
          lastUrl = queueItem.url;
        }
      });
      crawler.on("complete", function(queueItem, responseBuffer, response) {
         console.log('\x1b[35m', "Saved results to "+logfile);
      });
      crawler.start();
});
