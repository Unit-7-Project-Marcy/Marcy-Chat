const main = async() => {
const messageUL = document.getElementById('messages');
const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

const user = await window.fetchLoggedInUser();

window.setNav(!!user);


console.log(user)
// make a GET request for message history
const roomId = new URLSearchParams(window.location.search).get('room_id');

console.log(roomId)
fetch(`/api/message-history?room_id=${roomId}`)
  .then(response => response.json())
  .then(messages => {
    console.log(messages)
    messages.response.forEach((message) => {
      console.log(message)
      const item = document.createElement('li');
      item.id ="chatElement"
      item.textContent = message.messages;
      if (message.id === user.user.id) {
        item.classList.add('sent');
      } else {
        item.classList.add('received');
      }
      messageUL.appendChild(item);
    });
  })
  .catch(error => console.error(error));

// send message to server when form is submitted
const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const message = {
      text: input.value,
      senderId: user.user.id // assume userId is defined somewhere
    };
    socket.emit('chat message', message, roomId);
    input.value = '';
  }
});

// display new messages from server
socket.on('chat message', (message) => {
  console.log('msg sent')
  const item = document.createElement('li');
  item.id ="chatElement"
  item.textContent = message.text;
  if (message.senderId === user.user.id) {
    item.classList.add('sent');
  } else {
    item.classList.add('received');
  }
  messageUL.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
}

main()