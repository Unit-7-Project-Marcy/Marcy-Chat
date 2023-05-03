const chatRoomslist = document.getElementById('chatRooms');
console.log( document.querySelector('#main-nav'))
const main = async() => {
const socket = io();
const user = await window.fetchLoggedInUser()
window.setNav(user)
console.log(user.user.id)
let userid = user.user.id
fetch('/api/listRoom')
.then(response => response.json())
.then(data => {
    console.log(data)
    data.forEach(elem => {
        if(elem.type !== 'private'){
        const listElement = document.createElement('li')
        listElement.style.border = "2px solid black"
        listElement.style.padding = "5px"
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
        unique.forEach(elem => {
            user.textContent = `${elem} Users`
            users.append(user)
        })} else {
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

        chatRoomslist.append(listElement)
    }
    })
})
}
main()