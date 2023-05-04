const checkPasswords = (password1Id, password2Id) => {
    const password1 = document.getElementById(password1Id).value;
    const password2 = document.getElementById(password2Id).value;
    return password1 === password2;
  };

  Object.assign(window, { checkPasswords });