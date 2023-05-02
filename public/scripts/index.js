const main = async () => {
  const user = await window.fetchLoggedInUser();
  // window.setNav(!!user);
console.log(user)
if(!user) {
  document.querySelector('#Sign').innerHTML = `
  <div class="button-container d-flex">
  <div class="button1 mx-3 my-3">
  <a href="./create.html"><button class="btn btn-primary" type="submit">Sign Up</button></a>
  </div>
  <div class="button2 mx-3 my-3">
  <a href="./login.html"><button class="btn btn-primary" type="submit">Login</button></a>
  </div>
</div>
  `
} else {
  document.querySelector('#Sign').innerHTML = `
  <div class="button-container d-flex">
  <div class="button1 mx-3 my-3">
  <a href="./createChatrooms.html"><button class="btn btn-primary" type="submit">Create A Room</button></a>
  </div>
  <div class="button2 mx-3 my-3">
  <a href="./microphone.html"><button class="btn btn-primary" type="submit">Join Voice Chat</button></a>
  </div>
  <div class="button2 mx-3 my-3">
  <a href="./chatrooms.html"><button class="btn btn-primary" type="submit">Chatrooms</button></a>
  </div>
  <div class="button2 mx-3 my-3">
  <a href="./user.html"><button class="btn btn-primary" type="submit">Profile</button></a>
  </div>
</div>
  `
  const input = document.querySelector('#search-input')
  const searchResults = document.getElementById('searchResultsLive')

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
        })
    })

  })
  document.querySelector('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(input.value)
    window.location = '/search.html?username=' + input.value
  })
}
  
};

main();
