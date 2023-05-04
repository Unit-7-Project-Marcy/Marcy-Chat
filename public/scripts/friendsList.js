const main = async () => {
    const friendsList = document.querySelector('#friendsList')
    const pendingList = document.querySelector('#pendingList')
    const user = await window.fetchLoggedInUser()
    window.setNav(user)
    fetch(`/api/${user.user.id}/getFriends`).then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach(elem => {
            if(elem.username !== user.user.username){
            const list = document.createElement('li')
            const img = document.createElement('img')
            const button = document.createElement('button')
            button.textContent=`View Profile`
            button.classList.add("btn", "btn-primary")
            button.addEventListener('click',() => {
                window.location = '/viewProfile.html?id=' + elem.id
            })
            if(elem.profile_picture) {
                img.src=elem.profile_picture
            } else {
                img.src=`https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png`;
            }
            img.style.width=`25px`
            img.style.height=`25px`
            img.style.borderRadius="50%"
            friendsList.append(img)
            list.textContent=elem.username
            friendsList.append(list)
            friendsList.append(button)
        }
        })
    })

    fetch(`/api/${user.user.id}/pending`).then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach(elem => {
            if(elem.username !== user.user.username){
            const list = document.createElement('li')
            const img = document.createElement('img')
            list.style.textAlign="center"
            if(elem.profile_picture) {
                img.src=elem.profile_picture
            } else {
                img.src=`https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png`;
            }
            img.style.width=`25px`
            img.style.height=`25px`
            img.style.borderRadius="50%"
            pendingList.append(img)
            const accept = document.createElement('button')
            accept.textContent="Accept"
            const decline = document.createElement('button')
            const div = document.createElement('div')
            div.append(accept)
            div.append(decline)
            decline.textContent="Decline"
            accept.classList.add("btn", "btn-primary", 'mx-3')
            accept.addEventListener('click', () => {
                fetch('/api//responseFriendRequest/' + elem.id, {
                    method: "POST",
                    body: JSON.stringify({
                        "user_id":user.user.id,
                        "status":"accepted"
                    }),
                    headers: {
                        "Content-Type": "application/json"
                      }
                })
                accept.textContent = `Accepted`
            })
            decline.classList.add("btn", "btn-primary",'mx-3')
            decline.addEventListener('click', () => {
                fetch('/api//responseFriendRequest/' + elem.id, {
                    method: "POST",
                    body: JSON.stringify({
                        "user_id":user.user.id,
                        "status":"declined"
                    }),
                    headers: {
                        "Content-Type": "application/json"
                      }
                })
                accept.textContent = `Declined`
            })
            list.textContent=elem.username
            list.append(div)
            pendingList.append(list)
        }
        })
        
        
    })
}

main()