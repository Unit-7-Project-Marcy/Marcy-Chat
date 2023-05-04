const main = async () => {
    const friendsList = document.querySelector('#friendsList')
    const user = await window.fetchLoggedInUser()

    fetch(`/api/${user.user.id}/getFriends`).then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach(elem => {
            const list = document.createElement('li')
            list.textContent=username
            friendsList.append(list)
        })
    })
}

main()