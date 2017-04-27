var Chat = function (socket) {
  this.socket = socket;
};
Chat.prototype.sendMessage = function (room, text) {
  var message = {
    type: 0,
    room: room,
    text: text
  };
  this.socket.emit('message', message);
};
Chat.prototype.changeRoom = function (room) {
  this.socket.emit('join', {
    newRoom: room
  });
};
Chat.prototype.processCommand = function (command) {
  var words = command.split(' ');
  command = words[0].slice(1).toLowerCase();
  var message = '';
  switch (command) {
    case 'join':
      words.shift();
      var room = words.join(' ');
      this.changeRoom(room);
      break;
    case 'nick':
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name);
      break;
    default:
      message = '无效命令';
      break;
  }
  return message;
};