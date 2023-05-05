
const isAuthError = (err) => (err.status === 401 || err.status === 403);
const redirectToLogin = () => window.location.assign('/login.html');
const renderUsername = (username) => {
  document.querySelector('#username').textContent = username;
};


// Client-side code
const modal = document.getElementById('exampleModalLong');
const modalBody = document.querySelector('.modal-body');
const modalInstance = new bootstrap.Modal(modal);
const accept = document.getElementById('acceptModal')

const main = async () => {
  const user = await window.fetchLoggedInUser();
  console.log(user)
  if (!user.user) return redirectToLogin();
  const socket = io();

  socket.emit('login', user.user.id)
  console.log(user.user.id)
  socket.on('friend_req', (data) => {
    console.log('bing')
    fetch("/api/show?id=" + data.user_id)
    .then((response) => response.json())
    .then((data) => {
      const message = `${data.username} sent you a friend request!`;
      const p = document.createElement('p')
      p.textContent = message
      modalBody.append(p)
      modalInstance.show();
      accept.addEventListener('click', () => {
        window.location = '/friendsList.html'
      })
    })
  
    // Display the notification on the user's screen
  });
  const logoutForm = document.querySelector('#logout-form');
  const updateUsernameForm = document.querySelector('#username-form');

  const fileInput = document.querySelector('input[type="file"]');
  const image = document.querySelector('img')
  image.style.width="300px"
  image.style.height="300px"
  image.style.borderRadius="50%"
  if(user.user.profile_picture) {
  image.src = user.user.profile_picture
  } else {
    image.src = 'https://www.pngitem.com/pimgs/m/522-5220445_anonymous-profile-grey-person-sticker-glitch-empty-profile.png'
  }

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    console.log(fileInput.value);
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    fetch('/api/upload-profile-picture', {
      method:"POST",
      body:formData,
    }).then(response => response.json()).then(data => {
      console.log(data)
      image.src = `/${data.filepath}`;
      image.style.width="300px"
      image.style.height="300px"
    })
  });

  logoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    window.logOutHandler();
  });

  updateUsernameForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const [response, err] = await window.updateUsernameHandler(event.target);

    if (err) return isAuthError(err) ? redirectToLogin() : alert('Something went wrong');
    renderUsername(response.username);

    event.target.reset();
  });
  console.log(updateUsernameForm.dataset,)
  updateUsernameForm.dataset.userId =  user.user.id;

  window.setNav(!!user);
  renderUsername(user.user.username);

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
};

main();
