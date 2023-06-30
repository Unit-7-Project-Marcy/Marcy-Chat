
const chatRoom = async () => {
  const messageUL = document.getElementById("messages");
  const fileInput = document.getElementById("siofu_input");





  const fileUploadBtn = document.getElementById("file-upload-btn");
  fileUploadBtn.addEventListener("click", () => {
    fileInput.click();

    fileUploadBtn.classList.add("pressed");

    setTimeout(function () {
      fileUploadBtn.classList.remove("pressed");
    }, 200);
  });
  const socket = io();
  let imageSrc;
  const uploader = new SocketIOFileUpload(socket);
  uploader.listenOnInput(document.getElementById("siofu_input"));
  uploader.addEventListener("start", function (event) {
    console.log("Upload started:", event);
  });
  uploader.addEventListener("complete", function (event) {});

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  const user = await window.fetchLoggedInUser();

  window.setNav(!!user);

  const search = document.querySelector('#search-bar')
  const searchResults = document.getElementById('search-results')
  
  search.style.display = "none"

  console.log(user);
  // make a GET request for message history
  const roomId = new URLSearchParams(window.location.search).get("room_id");
  fetch('/api/findRoom/' + roomId).then(response => response.json()).then(data => {console.log(data)
    const roomName = data[0].name
    socket.emit('joinRoom', roomName);
    document.getElementById("RoomName").textContent = roomName
  })
  const response = await fetch('/api/findRoom/' + roomId)
  const data = await response.json()
  console.log(data)
  const roomName = data[0].name
  socket.emit("room id", roomId);
  if (user.user.profile_picture) {
    imageSrc = user.user.profile_picture;
  } else {
    imageSrc = `https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png`;
  }
  fetch(`/api/message-history?room_id=${roomId}`)
    .then((response) => response.json())
    .then((messages) => {
      console.log(messages);
      messages.response.forEach((message) => {
        console.log(message);
        if (message.type == "text") {
          const date = new Date(message.time_created);
          const timeString = date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          console.log(timeString);
          const item = document.createElement("li");
          const para = document.createElement("p");
          const username = document.createElement("p");
          const profilePic = document.createElement("img");
          if (message.profile_picture) {
            profilePic.src = message.profile_picture;
          } else {
            profilePic.src = `https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png`;
          }
          profilePic.style.width = "25px";
          profilePic.style.height = "25px";
          profilePic.style.borderRadius = "50%";
          para.textContent = timeString;
          username.textContent = message.username;
          username.style.color = "black";
          item.id = "chatElement";
          const messagePara = document.createElement('p')
          messagePara.textContent = message.messages;
          item.textContent= message.messages;
          item.append(profilePic);
          if (message.id === user.user.id) {
            item.classList.add("sent");
            para.classList.add("sent-text");
            messagePara.classList.add("sent")
            username.classList.add("sent-text");
          } else {
            item.classList.add("received");
            para.classList.add("received-text");
            username.classList.add("received-text");
            profilePic.id = "received-id"
          }
          messageUL.appendChild(username);
          messageUL.appendChild(item);
          messageUL.appendChild(para);
        } else if (message.type == "image") {
          const date = new Date(message.time_created);
          const timeString = date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          console.log(timeString);
          const list = document.createElement("li");
          const item = document.createElement("p");
          item.textContent = timeString;
          const image = document.createElement("img");
          const username = document.createElement("p");
          const profilePic = document.createElement("img");
          if (message.profile_picture) {
            profilePic.src = message.profile_picture;
          } else {
            profilePic.src = `https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png`;
          }
          profilePic.style.position = "absolute";
          profilePic.style.right = "5px";
          profilePic.style.borderRadius = "50%";
          username.textContent = message.username;
          username.style.color = "black";
          image.src = message.messages;
          image.style.width = "200px";
          image.style.height = "200px";
          profilePic.style.width = "25px";
          profilePic.style.height = "25px";
          item.id = "chatElement";
          if (message.id === user.user.id) {
            list.classList.add("sent");
            item.classList.add("sent-text");
            username.classList.add("sent-text");
          } else {
            list.classList.add("received");
            item.classList.add("received-text");
            username.classList.add("received-text");
            profilePic.id = "received-id"
          }

          list.append(image);
          list.append(profilePic);
          messageUL.appendChild(username);
          messageUL.appendChild(list);
          messageUL.appendChild(item);
        }
      });
      window.scrollTo({
        top: document.querySelector("#messages").scrollHeight,
        behavior: "smooth",
      });
    })
    .catch((error) => console.error(error));

  // send message to server when form is submitted
  const form = document.getElementById("form");
  const input = document.getElementById("input");

  const handleEmojiSelect = (emoji) => {
    input.value += emoji.native; // add the selected emoji to the form input
    picker.style.display = 'none'; // hide the emoji picker
  };

  const pickerOptions = { onEmojiSelect: handleEmojiSelect, autoFocus: true,}
  const picker = new EmojiMart.Picker(pickerOptions)
  document.querySelector('#emoji-picker-container').append(picker)
  picker.id = "emoji-picker"
  picker.style.display = "none"
  
  document.getElementById('emojiButton').addEventListener('click', () => {
    picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
  });
  

  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
      const message = {
        text: input.value,
        senderId: user.user.id,
        time_created: new Date(),
        username: user.user.username,

        roomName: document.getElementById("RoomName").textContent,
      };

      if (message.text.startsWith("ask an instructor:")) {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + config.api_key,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            max_tokens: 400,
            messages: [
              {
                role: "system",
                content: "You are an helpful instructor at the Marcy Lab School in Brookyn, New York City. Make sure you answer any of the students questions to the best of your ability. Make sure not to provide any code whatsoever. If the student asks you to write any code link the student to reference the documentation. Respond by telling the student as an AI Instructor, it's against my programming to provide any code and it's best you learn to code on your own. But also provide documentation for the student to use. If you have any questions, tell the student to contact an instructor. Most questions you should answer in javascript but you can also provide html and css help as long as express, node, and some other npm pakages if you feel the need it. You can provide psuedo code if you feel it is necessary.",
              },
              {
                role: "user",
                content: message.text,
              },
            ],
          }),
        };

        fetch("https://api.pawan.krd/v1/chat/completions", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            const responseText = data.choices[0].message.content;
            const responseMessage = {
              text: responseText,
              senderId: "AI Assistant",
              time_created: new Date(),
              username: "AI Instructor",
              backgroundColor: "#c4c4c4",
              color: "#000000",
              roomName,
              id:1,
            };
            console.log(responseMessage)
            socket.emit("chat message", responseMessage, roomId);
          })
          .catch((error) => {
            console.error(error)
            const responseMessage = {
              text: "Sorry, the API seems to be down for now. Try it out later!",
              senderId: "AI Assistant",
              time_created: new Date(),
              username: "AI Instructor",
              backgroundColor: "#c4c4c4",
              color: "#000000",
              roomName,
              id:1,
            };
            socket.emit("chat message", responseMessage, roomId);

          });
      }
      socket.emit("chat message", message, roomId);
      input.value = "";
    }
  });

  // display new messages from server
  socket.on("chat message", (message) => {
    console.log("msg sent", message);
    const item = document.createElement("li");
    const para = document.createElement("p");
    const image = document.createElement("img");
    const username = document.createElement("p");
    image.style.width = "25px";
    image.style.height = "25px";
    image.style.borderRadius = "50%";
    image.src = imageSrc;
    const date = new Date(message.time_created);
    const timeString = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    username.textContent = message.username;
    username.style.color = "black";
    para.textContent = timeString;
    item.id = "chatElement";
    item.textContent = message.text;
    if (message.senderId === user.user.id) {
      item.classList.add("sent");
      para.classList.add("sent-text");
      username.classList.add("sent-text");
    } else {
      item.classList.add("received");
      para.classList.add("received-text");
      username.classList.add("received-text");
    }
    item.append(image);
    messageUL.appendChild(username);
    messageUL.appendChild(item);
    messageUL.appendChild(para);
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("image message", (image) => {
    console.log("image sent", image[0]);
    const item = document.createElement("li");
    const para = document.createElement("p");
    const imageSent = document.createElement("img");
    const date = new Date(image[0].time_created);
    const timeString = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const username = document.createElement("p");
    username.textContent = user.user.username;
    username.style.color = "black";
    console.log(timeString);
    para.textContent = timeString;
    item.id = "chatElement";
    imageSent.src = image[0].messages;
    imageSent.style.width = "300px";
    imageSent.style.height = "300px";
    if (image[0].user_id == user.user.id) {
      imageSent.classList.add("sent");
      para.classList.add("sent-text");
      username.classList.add("sent-text");
    } else {
      imageSent.classList.add("received");
      para.classList.add("received-text");
      username.classList.add("received-text");
    }
    messageUL.append(username);
    messageUL.append(imageSent);
    messageUL.appendChild(para);
    window.scrollTo(0, document.body.scrollHeight);
  });
};

chatRoom();

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
    y: Math.random() * 12,
  };

  let anim = el.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: `translate(${to.x}rem, ${to.y}rem)` },
    ],
    {
      duration: (Math.random() + 1) * 2000, // random duration
      direction: "alternate",
      fill: "both",
      iterations: Infinity,
      easing: "ease-in-out",
    }
  );
});
