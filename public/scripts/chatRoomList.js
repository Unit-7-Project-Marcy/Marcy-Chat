const chatRoomslist = document.getElementById('chatRooms');

const main = async() => {
const user = await window.fetchLoggedInUser()
console.log(user.user.id)
let userid = user.user.id
fetch('/api/listRoom')
.then(response => response.json())
.then(data => {
    data.forEach(elem => {
        console.log(elem)
        const listElement = document.createElement('li')
        listElement.classList.add('d-flex','flex-row')
        const para = document.createElement('p')
        para.textContent = elem.name
        const users = document.createElement('ul')
        const user = document.createElement('li')
        let unique = [...new Set(elem.users)]

        unique.forEach(elem => {
            user.textContent = elem
            users.append(user)
        })
        const button = document.createElement('button')
        button.innerHTML = `<i class="fa-solid fa-circle-plus" style="color: #99ad00;"></i>`
        button.addEventListener('click', () => {
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
        listElement.append(para)
        listElement.append(button)
        listElement.append(users)

        chatRoomslist.append(listElement)
    })
})
}
main()