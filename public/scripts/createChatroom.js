const main = async () => {
const form = document.getElementById('form')
const roomName = document.getElementById('RoomName');
const desc = document.getElementById('Description');

const user = await window.fetchLoggedInUser();
window.setNav(!!user);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const requestBody = {
        roomName: roomName.value,
        description: desc.value,
        type:"public"
      };
      console.log('Before stringifying:', requestBody);
    if (roomName.value && desc.value) {
      fetch('/api/create-room', {
        method: "POST",
        body:  JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json"
          }
      }).then(response => response.json()).then(data => {
        window.location.href =`/chatroom.html?room_id=${data.id}`
      })
    }
});
}

main()