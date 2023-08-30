import { io } from './http';

interface IRoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface IMessage {
  room: string;
  text: string;
  createdAt: Date;
  username: string;
}

const users: IRoomUser[] = [];

const messages: IMessage[] = [];

io.on('connection', (socket) => {
  socket.on('select_room', (data: { username: string; room: string; }, callback) => {
    socket.join(data.room);

    const userInRoom = users.find((user) => user.username === data.username && user.room === data.room);

    if(userInRoom) {
      userInRoom.socket_id = socket.id;
    } else {
      users.push({
        room: data.room,
        username: data.username,
        socket_id: socket.id
      });
    }

    const messagesRoom = getMessagesRoom(data.room);
    callback(messagesRoom);
  });

  socket.on('message', (data: { room: string; message: string; username: string; }) => {
    // Salva as mensagens
    const message: IMessage = {
      room: data.room,
      username: data.username,
      text: data.message,
      createdAt: new Date()
    };

    messages.push(message);

    // Envia para usuários da sala
    io.to(data.room).emit('message', message);
  });
});

function getMessagesRoom(room: string) {
  const messagesRoom = messages.filter((message) => message.room === room);

  return messagesRoom;
}
