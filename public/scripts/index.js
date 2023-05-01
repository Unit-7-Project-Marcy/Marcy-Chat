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
}
  
};

main();
