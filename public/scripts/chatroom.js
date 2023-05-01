
const main = async() => {
const messageUL = document.getElementById('messages');
const fileInput = document.getElementById("siofu_input");

const fileUploadBtn = document.getElementById("file-upload-btn");
fileUploadBtn.addEventListener("click", () => {
  fileInput.click();

  fileUploadBtn.classList.add("pressed");
  
  setTimeout(function() {
    fileUploadBtn.classList.remove("pressed");
  }, 200);
});
const socket = io();
let imageSrc
const uploader = new SocketIOFileUpload(socket);
uploader.listenOnInput(document.getElementById("siofu_input"));
uploader.addEventListener("start", function(event){
  console.log("Upload started:", event);
});
uploader.addEventListener("complete", function(event){

});



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
socket.emit('room id',roomId)
if(user.user.profile_picture) {
  imageSrc = user.user.profile_picture
} else {
  imageSrc= `https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png`
}
console.log(roomId)
fetch(`/api/message-history?room_id=${roomId}`)
  .then(response => response.json())
  .then(messages => {
    console.log(messages)
    messages.response.forEach((message) => {
    console.log(message)
    if(message.type == "text"){
    const date = new Date(message.time_created);
    const timeString = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    console.log(timeString);

      const item = document.createElement('li');
      const para = document.createElement('p')
      para.textContent = timeString
      item.id ="chatElement"
      item.textContent = message.messages;
      if (message.id === user.user.id) {
        item.classList.add('sent');
        para.classList.add('sent-text');

      } else {
        item.classList.add('received');
        para.classList.add('received-text')
      }
      messageUL.appendChild(item);
      messageUL.appendChild(para)
    }
    else if(message.type == "image"){
      const date = new Date(message.time_created);
      const timeString = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      console.log(timeString);
  
        const item = document.createElement('p');
        item.textContent = timeString
        const image = document.createElement('img')
        image.src = message.messages
        image.style.width="300px"
        image.style.height="300px"
        item.id ="chatElement"
        if (message.id === user.user.id) {
          image.classList.add('sent');
          item.classList.add('sent-text');
  
        } else {
          image.classList.add('received');
          item.classList.add('received-text')
        }
        messageUL.appendChild(image)
        messageUL.appendChild(item)
      }
    });
    window.scrollTo({
      top: document.querySelector('#messages').scrollHeight,
      behavior: "smooth"
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
      senderId: user.user.id, // assume userId is defined somewhere
      time_created: new Date()
    };
    socket.emit('chat message', message, roomId);
    input.value = '';
  }
});

// display new messages from server
socket.on('chat message', (message) => {
  console.log('msg sent',message)
  const item = document.createElement('li');
  const para = document.createElement('p')
  const image = document.createElement('img')
  image.src = imageSrc
  const date = new Date(message.time_created);
  const timeString = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  console.log(timeString);
  para.textContent=timeString
  item.id ="chatElement"
  item.textContent = message.text;
  if (message.senderId === user.user.id) {
    item.classList.add('sent');
    para.classList.add('sent-text');
  } else {
    item.classList.add('received');
    para.classList.add('received-text')
  }
  messageUL.appendChild(item);
  messageUL.appendChild(para);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('image message', (image) => {
  console.log('image sent', image[0])
  const item = document.createElement('li');
  const para = document.createElement('p')
  const imageSent = document.createElement('img')
  const date = new Date(image[0].time_created);
  const timeString = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  console.log(timeString);
  para.textContent=timeString
  item.id ="chatElement"
  imageSent.src = image[0].messages;
  imageSent.style.width ="300px"
  imageSent.style.height ="300px"
  console.log(user.user.id)
  if (image[0].user_id == user.user.id) {
    imageSent.classList.add('sent');
    para.classList.add('sent-text');
  } else {
    imageSent.classList.add('received');
    para.classList.add('received-text')
  }
  messageUL.append(imageSent);
  messageUL.appendChild(para);
  window.scrollTo(0, document.body.scrollHeight);
})


}


main()

// Some random colors
const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

const numBalls = 50;
const balls = [];

for (let i = 0; i < numBalls; i++) {
  let ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  ball.style.left = `${Math.floor(Math.random() * 100)}%`;
  ball.style.top = `${Math.floor(Math.random() * 100)}%`;
  ball.style.transform = `scale(${Math.random()})`;
  ball.style.width = `${Math.random()}em`;
  ball.style.height = ball.style.width;
  
  balls.push(ball);
  document.body.append(ball);
}

// Keyframes
balls.forEach((el, i, ra) => {
  let to = {
    x: Math.random() * (i % 2 === 0 ? -11 : 11),
    y: Math.random() * 12
  };

  let anim = el.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: `translate(${to.x}rem, ${to.y}rem)` }
    ],
    {
      duration: (Math.random() + 1) * 2000, // random duration
      direction: "alternate",
      fill: "both",
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
});
