
const main = async () => {
  const user = await window.fetchLoggedInUser();
  console.log(user);
  if (user) return window.location.assign('/user.html');

  document.querySelector('#create-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!window.checkPasswords("password1", "password2")) {
        // alert("The passwords do not match. Please try again.");
        // event.stopPropagation();
      } else {
        window.signupAndLoginHandler('/api/users', event.target);
      }
    });
};

main();
