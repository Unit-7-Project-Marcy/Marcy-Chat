
const isAuthError = (err) => (err.status === 401 || err.status === 403);
const redirectToLogin = () => window.location.assign('/login.html');
const renderUsername = (username) => {
  document.querySelector('#username').textContent = username;
};

const main = async () => {
  const user = await window.fetchLoggedInUser();
  if (!user) return redirectToLogin();

  console.log(user)

  const logoutForm = document.querySelector('#logout-form');
  const updateUsernameForm = document.querySelector('#username-form');

  const fileInput = document.querySelector('input[type="file"]');
  const image = document.querySelector('img')
  image.style.width="300px"
  image.style.height="300px"
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

  updateUsernameForm.dataset.userId = user.id;

  window.setNav(!!user);
  renderUsername(user.username);
};

main();
