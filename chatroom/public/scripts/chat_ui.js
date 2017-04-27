var socket = io.connect();
var createElementByType = function (message) {
  switch (message.type) {
    // 不可信任的消息, 用户输入消息
    case 0:
    case 1:
      var type = message.type;
      message = $('<i></i>').text(message.text);
      return $('<div class="user-message user-message-'+ type +'"></div>').append(message);
      break;
    default:
    case 2:
      // 可信任消息, 系统消息
      return $('<div class="system-message"></div>').html('<i>' + message.text + '</i>');
  }
};
// 不可信任的消息
// function divEscapedContentElement(message, className) {
//   message = $('<i></i>').text(message);
//   return $('<div class=' + className +'></div>').append(message);
// }
// // 可信任的消息
// function divSystemContentElement(message) {
//   return $('<div class="system-message"></div>').html('<i>' + message + '</i>');
// }
function processUserInput(chatApp, socket) {
  var $sendMessage = $('#send-message');
  var $message = $('#message');
  var message = $sendMessage.val();
  var systemMessage = false;
  if (message[0] === '/') {
    systemMessage = chatApp.processCommand(message);
  }
  if (systemMessage) {
    systemMessage = {
      type: 2,
      text: systemMessage
    };
    $message.append(createElementByType(systemMessage));
  } else {
    // room, message
    chatApp.sendMessage($('#room-title').text(), message);
    message = {
      type: 0,
      text: message
    };
    $message.append(createElementByType(message));
    // $message.scrollTop($message.prop('scrollHeight'));
  }
  $sendMessage.val('');
}
$(document).ready(function () {
  var $sendMessage = $('#send-message');
  var $message = $('#message');
  var $roomTitle = $('#room-title');
  var $roomListHook = $('#room-list-hook');
  var chatAPP = new Chat(socket);
  socket.on('nameResult', function (result) {
    var message;
    if (result.success) {
      message = {
        type: 2,
        text: '您的昵称是 ' + result.name + ' .'
      };
    } else {
      message = {
        type: 2,
        text: result.message
      };
    }
    var dom = createElementByType(message);
    $message.append(dom);
  });
  socket.on('joinResult', function (result) {
    $roomTitle.text(result.room);
    var message = {
      type: 2,
      text: '您已更换到了' + result.room
    };
    $message.append(createElementByType(message));
  });
  socket.on('message', function (message) {
    var newElement = createElementByType(message);
    $message.append(newElement);
  });
  socket.on('rooms', function (rooms) {
    $roomListHook.empty();
    for (var room in rooms) {
      if ((room !== '') && (room.length !== 20)) {
        var message = {
          type: 2,
          text: room
        };
        $('#room-list-hook').append(createElementByType(message));
      }
    }
    $roomListHook.find('div').click(function () {
      chatAPP.processCommand('/join ' + $(this).find('i').text());
      $sendMessage.focus();
    });
  });
  setInterval(function () {
    socket.emit('rooms');
  }, 1000);
  $sendMessage.focus();

  $('#send-form').submit(function () {
    processUserInput(chatAPP, socket);
    return false;
  });
  $sendMessage.keydown(function (event) {
    if (event.which === 13) {
      processUserInput(chatAPP, socket);
      return false;
    }
  })
});