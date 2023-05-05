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
            button.classList.add('btn', 'btn-primary')
            button.style.marginTop = "7px"
            button.textContent ="View Profile"
            listEle.classList.add('d-flex', 'flex-row-reverse')
            image.style.width = "25px"
            image.style.height = "25px"
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
}

main()