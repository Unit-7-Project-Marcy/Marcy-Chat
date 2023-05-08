const chatRoomslist = document.getElementById('chatRooms');
const directMessages = document.getElementById('directMessages')
const main = async() => {
const socket = io();
const user = await window.fetchLoggedInUser()
window.setNav(user)
let userid = user.user.id

const button = document.querySelector('#voiceButton')
const room = document.querySelector('#voiceInput')
console.log(room.value)
button.addEventListener('click', (e) => {
  e.preventDefault()
  if(room.value.length > 0){
  window.location = `/microphone.html?roomName=${room.value}`
  }
})

fetch('/api/listRoom')
.then(response => response.json())
.then(data => {
    console.log(data)
    data.forEach(elem => {

        if(elem.type !== 'private'){
        const listElement = document.createElement('li')
        listElement.style.border = "2px solid black"
        listElement.style.padding = "5px"
        listElement.style.width = "25em"
        listElement.classList.add('d-flex','flex-row','justify-content-between','align-items-center')
        const div = document.createElement('div')
        const textDiv = document.createElement('div')
        textDiv.classList.add('d-flex','flex-column','justify-content-between')
        div.classList.add('d-flex', 'flex-column', 'align-items-end')
        const para = document.createElement('p')
        para.textContent = `Room Name: ${elem.name}`
        const desc = document.createElement('p')
        desc.textContent = `Description: ${elem.description}`
        para.style.margin = 0
        desc.style.margin = 0
        const users = document.createElement('ul')
        const user = document.createElement('li')
        users.style.listStyle = "none"
        let unique = [...new Set(elem.users)]
        if(unique.length > 0) {
            user.textContent = `${unique.length} Users`
            users.append(user)
        } else {
            user.textContent = `No Users`
            users.append(user)
        }
        const button = document.createElement('button')
        button.style.border = '0'
        button.style.backgroundColor = "transparent"
        button.innerHTML = `<i class="fa-solid fa-circle-plus" style="color: #99ad00;"></i>`
        button.addEventListener('click', () => {
            socket.emit('joinRoom',elem.name)
            fetch('/api/joinRoom', {
                method: "POST",
                body: JSON.stringify({
                    "roomId":elem.id,
                    "userId":userid
                }),
                headers: {
                    "Content-Type": "application/json"
                  }
            })
            window.location.href = `/chatroom.html?room_id=${elem.id}`
        })
        textDiv.append(para)
        textDiv.append(desc)
        div.append(button)
        div.append(users)
        listElement.append(textDiv)
        listElement.append(div)
        listElement.classList.add('mb-3')
        chatRoomslist.append(listElement)
    }
    else{
      const regex = /Direct message between (\w+) and (\w+)/;
      const matches = elem.description.match(regex);
      const user1 = matches[1];
      const user2 = matches[2];
      if(user.user.username == user1 || user.user.username == user2) {
        console.log(elem)
        const listElement = document.createElement('li')
        listElement.style.border = "2px solid black"
        listElement.style.padding = "5px"
        listElement.style.width = "25em"
        listElement.classList.add('d-flex','flex-row','justify-content-between','align-items-center')
        const div = document.createElement('div')
        const textDiv = document.createElement('div')
        textDiv.classList.add('d-flex','flex-column','justify-content-between')
        div.classList.add('d-flex', 'flex-column', 'align-items-end')
        const para = document.createElement('p')
        para.textContent = `User: ${elem.name}`
        const desc = document.createElement('p')
        para.style.margin = 0
        desc.style.margin = 0
        
        const button = document.createElement('button')
        button.style.border = '0'
        button.style.backgroundColor = "transparent"
        button.innerHTML = `<i class="fa-solid fa-circle-plus" style="color: #99ad00;"></i>`
        button.addEventListener('click', () => {
            socket.emit('joinRoom',elem.name)
            fetch('/api/joinRoom', {
                method: "POST",
                body: JSON.stringify({
                    "roomId":elem.id,
                    "userId":userid
                }),
                headers: {
                    "Content-Type": "application/json"
                  }
            })
            window.location.href = `/chatroom.html?room_id=${elem.id}`
        })
        textDiv.append(para)
        div.append(button)
        listElement.append(textDiv)
        listElement.append(div)
        listElement.classList.add('mb-3')
        directMessages.append(listElement)     
       }
    }
    })
})
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