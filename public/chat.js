const socket = io();

const urlsSearch = new URLSearchParams(window.location.search);
const username = urlsSearch.get('username');
const room = urlsSearch.get('select_room');

const usernameDiv = document.getElementById('username');

usernameDiv.innerHTML = `Olá ${username} - Você está na sala ${room}`;

socket.emit(
  'select_room',
  {
    username,
    room
  },
  (messages) => {
    messages.forEach((message) => {
      createMessage(message);
    });
  }
);

document.getElementById('message_input').addEventListener('keypress', (event) => {
  if(event.key === 'Enter') {
    const message = event.target.value;

    const data = {
      room,
      message,
      username
    };

    socket.emit('message', data);

    event.target.value = '';
  }
});

socket.on('message', (data) => {
  createMessage(data);
});

function createMessage(data) {
  const messageDiv = document.getElementById('messages');

  messageDiv.innerHTML += `
  <div class="new_message">
    <label class="form_label">
      <strong>${data.username}</strong> <span>${data.text} - ${dayjs(data.createdAt).format('DD/MM HH:mm')}</span>
    </label>
  </div>
  `;
}

document.getElementById('logout').addEventListener('click', (event) => {
  window.location.href = 'index.html';
});
