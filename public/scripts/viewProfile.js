const main = async () => {
    const user = await window.fetchLoggedInUser();
    window.setNav(user) 
    const id = new URLSearchParams(window.location.search).get("id");
    fetch('/api/show?id=' + id).then(response => response.json())
    .then(data => {console.log(data)
       const image = document.querySelector('img')
       image.style.width = "150px"
       image.style.height = "150px"
       const username = document.querySelector('#username')
       username.textContent = data.username
       if(data.profile_picture) {
        image.src = data.profile_picture
       } else {
        image.src = 'https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png'
       }
    })
}

main()