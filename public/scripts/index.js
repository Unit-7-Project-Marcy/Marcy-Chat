

const main = async () => {
  const user = await window.fetchLoggedInUser();
  // window.setNav(!!user);
console.log(user)
if(!user) {
  document.querySelector('#Sign').innerHTML = `
  <div class="button-container d-flex">
  <div class="button1 mx-3 my-3">
  <a href="./create.html"><button class="btn btn-dark" type="submit">Sign Up</button></a>
  </div>
  <div class="button2 mx-3 my-3">
  <a href="./login.html"><button class="btn btn-dark" type="submit">Login</button></a>
  </div>
</div>
  `
} else {
  document.querySelector('#Sign').innerHTML = `
  <div class="button-container d-flex flex-column flex-sm-row align-items-center row justify-content-center" style="text-align:center;">
  <div class="button1 mx-3 my-3 col-6 col-sm-3 d-flex flex-column">
  <i class="fa-solid fa-plus mb-3" style="color: #000000;"></i>
  <a href="./createChatrooms.html"><button class="btn btn-dark" type="submit">Create A Room</button></a>
  </div>
  <div class="button2 mx-3 my-3 col-6 col-sm-3 d-flex flex-column">
  <i class="fa-solid fa-headphones-simple mb-3" style="color: #000000;"></i>
  <a href="./createVoicechat.html"><button class="btn btn-dark" type="submit">Create Voice Chat</button></a>
  </div>
  <div class="button2 mx-3 my-3 col-6 col-sm-3 d-flex flex-column">
  <i class="fa-solid fa-comments mb-3" style="color: #000000;"></i>
  <a href="./chatrooms.html"><button class="btn btn-dark" type="submit">Chatrooms</button></a>
  </div>
  <div class="button2 mx-3 my-3 col-6 col-sm-3 d-flex flex-column">
  <i class="fa-solid fa-user-group mb-3" style="color: #000000;"></i>
  <a href="./friendsList.html"><button class="btn btn-dark" type="submit">Friend List</button></a>
  </div>
  <div class="button2 mx-3 my-3 col-6 col-sm-3 d-flex flex-column">
  <i class="fa-solid fa-user mb-3" style="color: #000000;"></i>
  <a href="./user.html"><button class="btn btn-dark" type="submit">Profile</button></a>
  </div>
</div>
  `
  document.querySelector('#form').innerHTML = `
  <form id="searchForm" class ="d-flex align-items-center mb-3 justify-content-center">
  <input type="text" autocomplete="off" placeholder="Search Users..." class="form-control" id="search-input" aria-describedby="search">
<button type="submit" class="btn btn-dark mx-2">
  <i class="fa fa-search"></i>
</button>
</form>
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
          if(elem.id !== user.user.id){
            const listEle = document.createElement('li')
            const image = document.createElement('img')
            const button = document.createElement('button')
            button.addEventListener('click', function(){
              window.location = '/viewProfile.html?id=' + elem.id
            })
            button.classList.add('btn', 'btn-dark')
            button.style.marginTop = "7px"
            button.style.marginBottom = "7px"
            button.textContent ="View Profile"
            listEle.classList.add('d-flex', 'flex-row-reverse', 'justify-content-center')
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
  document.querySelector('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(input.value)
    window.location = '/search.html?username=' + input.value
  })
}
  
};

main();
