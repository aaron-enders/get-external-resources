var gulp = require('gulp'),
resources = require('gulp-resources');
var Crawler = require('simplecrawler');
var footer = require('gulp-footer');
var clean = require('gulp-clean');
newfile           = require('gulp-file');
timestamp           = require('time-stamp');
prompt           = require('gulp-prompt');

fs = require('fs');
fileType = require('file-type');



gulp.task('resources', function(cb) {


   gulp.src('gulpfile.js')
   .pipe(prompt.prompt({
      type: 'input',
      name: 'url',
      message: 'What URL do you want to crawl?'
   }, function(res){


      var logfile = encodeURIComponent(res.url.replace("https:\\\\", "").replace("http:\\\\", ""))+"/result-"+timestamp("YYYY-MM-DD-mm-ss")+".csv";
      newfile(logfile, "").pipe(gulp.dest('/wamp64/www/bluehouse.de/getresources/'));
      var crawler = Crawler(res.url);
      crawler.on("invaliddomain", function(queueItem, responseBuffer, response) {

         if (queueItem.url.indexOf("/Fluid/ViewHelpers") !== -1 ||
         queueItem.url.indexOf("http://typo3.org/") !== -1 ||
         queueItem.url.indexOf("http://www.w3.org") !== -1 ||
         queueItem.url.indexOf("http://typo3.org/") !== -1 ||
         queueItem.url.indexOf("http://typo3.org/") !== -1 ||
         queueItem.url.indexOf("http://typo3.org/") !== -1 ||
         queueItem.url.indexOf("http://typo3.org/") !== -1

      ){

         }else{
            fs.readFile(logfile, function (err, data) {
              if (err) throw err;
              if(data.indexOf(queueItem.url) >= 0){

              }else{
                console.log("--- External: %s (%d bytes) ", queueItem.url);
                var filetype= "unbekannt";
                if (queueItem.url.indexOf(".js") !== -1){ filetype = "Javascript"; }
                if (queueItem.url.indexOf(".css") !== -1){ filetype = "CSS"; }
                fs.appendFile(logfile, queueItem.host+";"+queueItem.url+"\r\n", function (err) {
                    if (err) throw err;
                });
             }
            });
         }


      });
      crawler.on("fetchcomplete",function(queueItem, responseBuffer, response) {
      	console.log("Internal: %s (%d bytes) ", queueItem.url);
      });
      crawler.on("complete", function(queueItem, responseBuffer, response) {
         console.log("COMPLETE!");

      });
      crawler.start();



   }));

});
