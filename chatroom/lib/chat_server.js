var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function (server) {
  io = socketio(server);
  io.on('connection', function (socket) {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    joinRoom(socket, '默认房间');
    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoin(socket);
    socket.on('rooms', function () {
      socket.emit('rooms', io.sockets.adapter.rooms);
    });
    handleClientDisconnection(socket, nickNames, namesUsed);
  });
};
var assignGuestName = function (socket, guestNumber, nickNames, namesUsed) {
  var name = 'guest' +  guestNumber;
  nickNames[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    name: name
  });
  namesUsed.push(name);
  return guestNumber + 1;
};
var joinRoom = function (socket, room) {
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit('joinResult', {room: room});
  //需要测试
  // io.to(room, {
  //   text: nickNames[socket.id] + ' has joined ' + room + '.'
  // });
  socket.broadcast.to(room).emit('message', {
    text: '欢迎' + nickNames[socket.id] + '加入 ' + room + '.'
  });
  var userInRoom = io.sockets.adapter.rooms[room];
  if ( userInRoom && userInRoom.length > 1) {
    var userInRoomSummary = room + '房间内的用户有: ';
    var count = 0;
    for (var key in userInRoom.sockets) {
      var userSocketId = key;
      if (count > 0) {
        userInRoomSummary += ', ';
      }
      count++;
      userInRoomSummary += nickNames[userSocketId];
    }
    userInRoomSummary += '. ';
    socket.emit('message', {
      type: 2,
      text: userInRoomSummary
    });
  }
};
var handleNameChangeAttempts = function (socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function (name) {
    if (/^Guest/.test(name)) {
      socket.emit('nameResult', {
        success: false,
        message: '您更改之后的昵称不能以`Guest`开头'
      });
    } else {
      if (namesUsed.indexOf(name) == -1) {
        // 被替换的名字
        var preName = nickNames[socket.id];
        var preNameIdx = namesUsed.indexOf(preName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[preNameIdx];
        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: preName + ' 更名为 ' + name
        });
      } else {
        socket.emit('nameResult', {
          success: false,
          message: '此昵称已被占用'
        });
      }
    }
  });
};
var handleMessageBroadcasting = function (socket) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      type: 1,
      text: nickNames[socket.id] + ': ' + message.text
    })
  });
};
var handleRoomJoin = function (socket) {
  socket.on('join', function (room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom)
  })
};
var handleClientDisconnection = function (socket) {
  socket.on('disconnet', function () {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
};
