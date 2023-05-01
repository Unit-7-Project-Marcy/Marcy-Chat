const main = async () => {
  const user = await window.fetchLoggedInUser();
  console.log(user)
  if (user) return window.location.assign('/user.html');

  document.querySelector('#create-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();
      window.signupAndLoginHandler('/api/users', event.target);
    });
};

main();
