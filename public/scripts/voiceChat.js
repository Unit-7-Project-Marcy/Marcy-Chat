function generateRoomName(prefix, length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let roomName = prefix;
    for (let i = 0; i < length; i++) {
      roomName += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return roomName;
  }
  
  const roomName = generateRoomName(`roomid-`, 6);
const button = document.querySelector('#createRoom')

button.addEventListener('click', (e) => {
    e.preventDefault()
  window.location = `/microphone.html?roomName=${roomName}`
})
