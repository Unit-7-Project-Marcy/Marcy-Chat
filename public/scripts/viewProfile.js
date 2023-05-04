const main = async () => {
  const user = await window.fetchLoggedInUser();
  const socket = io();

  window.setNav(user);
  const username = document.querySelector("#username");
  const messaging = document.querySelector("#DirectMessage");
  const voicechat = document.querySelector('#voiceChat')
  const friendButton = document.querySelector("#friend")
  const requestBody = {};
  const id = new URLSearchParams(window.location.search).get("id");

  fetch("/api/friendshipStatus/" + id, {
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify({
      "user_id": user.user.id.toString(),
    })
  }).then(response => response.json())
  .then(data => {
    console.log(data)
    if(data.length > 0 && data[0].status == "pending") {
      friendButton.textContent = `Friend Request Sent`
    }
     else if(data.length > 0 && data[0].status == "accepted") {
      friendButton.textContent = `Remove friend`
      friendButton.addEventListener('click', () => {
        fetch('/api/delete/' + id, {
          method:"DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body:userObj
        }).then(response => response.json())
        .then(data => {
          console.log(data)
        })
      })
    }
    else {
      friendButton.textContent = `Add friend`
      friendButton.addEventListener('click', () => {
        fetch('/api/friendRequest/' + id, {
          method:"POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:userObj
        }).then(response => response.json())
        .then(data => {
          console.log(data)
        })
      })
    }
  })


  fetch("/api/show?id=" + id)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if(data.username=='AI instructor') {
        friendButton.style.display="none"
      }
      const image = document.querySelector("img");
      image.style.width = "150px";
      image.style.height = "150px";
      image.style.borderRadius = " 50%";
      username.textContent = data.username;
      voicechat.addEventListener('click', () => {
        window.location = `/microphone.html?roomName=${data.username}+${user.user.username}`
      })
      if (data.profile_picture) {
        image.src = data.profile_picture;
      } else {
        image.src =
          "https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png";
      }
      requestBody.roomName = data.username;
      requestBody.description = `Direct message between ${data.username} and ${user.user.username}`;
      requestBody.type ='private'
    });

  fetch("/api/listRoom")
    .then((response) => response.json())
    .then((data) => {
      let foundRoom = data.filter((elem) => elem.name == requestBody.roomName);
      if (foundRoom.length > 0) {
        messaging.addEventListener("click", () => {
          socket.emit("joinRoom", foundRoom[0].name);
          fetch("/api/joinRoom", {
            method: "POST",
            body: JSON.stringify({
              roomId: foundRoom[0].id,
              userId: user.user.id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          window.location.href = `/chatroom.html?room_id=${foundRoom[0].id}`;
        });
      } else {
        messaging.addEventListener("click", () => {
          fetch("/api/create-room", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              window.location.href = `/chatroom.html?room_id=${data.id}`;
            });
        });
      }
    });
   
    const userObj = JSON.stringify({
      "user_id": user.user.id.toString(),
    })
    console.log(userObj)

};

main();
