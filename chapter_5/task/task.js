var http = require('http');
var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2);
var command = args.shift();
var taskDescription = args.join(' ');
var file = path.join(process.cwd(), '/tasks');
switch (command) {
  case 'list':
    showTasks(file);
    break;
  case 'add':
    addTask(file, taskDescription);
    break;
  default:
    console.log('Usage' + process.argv[0] + ' list or add [taskDescription]');
}
function loadOrInitializeTaskArray(file, cb) {
  fs.exists(file, function (exists) {
    var tasks = '';
    if (exists) {
      fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
          throw err;
        }
        tasks = JSON.parse(data || '[]');
        cb(tasks);
      })
    } else {
      cb([]);
    }
  });
}
function showTasks(file) {
  loadOrInitializeTaskArray(file, function (tasks) {
    for (var i in tasks) {
      console.log(i + ' > ' + tasks[i] + '\n');
    }
  });
}
function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks, null, 4), 'utf8', function (err) {
    if (err) {
      throw err;
    }
    console.log('tasks saved');
  })
}
function addTask(file, taskDescription) {
  loadOrInitializeTaskArray(file, function (tasks) {
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  })
}