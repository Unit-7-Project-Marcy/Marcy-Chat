
const voiceChat = async () => {
  const user = await window.fetchLoggedInUser()
  window.setNav(user)
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
const input = document.querySelector('#RoomName')
console.log(input.value)
button.addEventListener('click', (e) => {
  e.preventDefault()
  if(input.value.length > 0){
  window.location = `/microphone.html?roomName=${input.value}`
  }
})

}

voiceChat()