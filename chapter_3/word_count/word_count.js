var fs = require('fs');
var completeTasks = 0;
var tasks = [];
var wordCounts = {};
var fileDir = './text';

function checkIfComplete() {
  completeTasks++;
  if (completeTasks == tasks.length) {
    for (var word in wordCounts) {
      console.log(word + ': ' + wordCounts[word] + '次');
    }
  }
}
function countWordsInText(text) {
  var words = text.toLowerCase().split(/\W+/).join('');
  for (var index in words) {
    var word = words[index];
    if (word) {
      wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
    }
  }
}
fs.readdir(fileDir, function (err, files) {
  if (err) {
    throw err;
  }
  for (var index in files) {
    var task = (function (file) {
      return function () {
        fs.readFile(file, function (err, text) {
           if (err) {
            throw  err;
          }
          text = text.toString();
          countWordsInText(text.toString());
          checkIfComplete();
        });
      }
    })(fileDir + '/' + files[index]);
    tasks.push(task);
  }
  for (var task in tasks) {
    tasks[task]()
  }
});