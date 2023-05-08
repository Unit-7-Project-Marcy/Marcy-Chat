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
      friendButton.classList.add("btn", "btn-danger")
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
        friendButton.textContent = `Friend Request Sent`
        fetch('/api/friendRequest/' + id, {
          method:"POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:userObj
        }).then(response => response.json())
        .then(data => {
          console.log(data)
          socket.emit('friend req', data)
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

    const input = document.querySelector('#search-bar')
const searchResults = document.getElementById('search-results')

input.addEventListener('input', (e) => {
    console.log(input.value)
    if(searchResults.querySelectorAll('li').length > 0) {
      searchResults.innerHTML = ``
    } 
    console.log(input.value.length)

    fetch('/api/find?username=' + input.value).then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach(elem => {
          if(elem.id !== user.user.id){
            const listEle = document.createElement('li')
            const image = document.createElement('img')
            const button = document.createElement('button')
            button.addEventListener('click', function(){
              window.location = '/viewProfile.html?id=' + elem.id
            })
            button.classList.add('btn', 'btn-dark')
            button.style.marginTop = "7px"
            button.textContent ="View Profile"
            listEle.classList.add('d-flex', 'flex-row-reverse')
            image.style.width = "25px"
            image.style.height = "25px"
            image.style.borderRadius = "50%"
            if(elem.profile_picture) {
              image.src = elem.profile_picture
            } else {
              image.src = 'https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png'
            }
            listEle.classList.add('list-group-item')
            listEle.textContent = elem.username
            listEle.append(image)
            image.style.marginRight = "7px"
            searchResults.append(listEle)
            searchResults.append(button)
            if(input.value.length < 1) {
              searchResults.innerHTML = ``
              console.log('hey')
            }
          }
        })
    })

  })

};

main();
