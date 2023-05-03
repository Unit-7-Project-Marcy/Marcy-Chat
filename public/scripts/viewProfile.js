const main = async () => {
  const user = await window.fetchLoggedInUser();
  const socket = io();

  window.setNav(user);
  const username = document.querySelector("#username");
  const messaging = document.querySelector("#DirectMessage");
  const requestBody = {};
  const id = new URLSearchParams(window.location.search).get("id");
  fetch("/api/show?id=" + id)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const image = document.querySelector("img");
      image.style.width = "150px";
      image.style.height = "150px";
      image.style.borderRadius = " 50%";
      username.textContent = data.username;
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
};

main();
