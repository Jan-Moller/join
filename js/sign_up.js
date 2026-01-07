async function signUp() {
  if (!checkPasswordConfirmation()) { return false }
  else {
    await createUser();
    showSignUpMsg();
    setTimeout(() => { window.location.href = 'index.html'; }, 3000);
  }
}

function checkPasswordConfirmation() {
  let password = document.getElementById('passwordInput');
  let confirmedPassword = document.getElementById('confirmPasswordInput')

  if (password.value === confirmedPassword.value) { return true }
  else {
    passwordsNoMatching(password, confirmedPassword);
    return false;
  }
}

function passwordsNoMatching(password, confirmedPassword) {
  let errorMsg = document.getElementById('sign_up_error_msg')
  password.classList.add('wrong_password');
  confirmedPassword.classList.add('wrong_password');
  errorMsg.style.display = 'block';

}

async function createUser() {
  let name = document.getElementById('name');
  let mail = document.getElementById('mail');
  let password = document.getElementById('passwordInput')

  let user = {
    'name': name.value,
    'mail': mail.value,
    'password': password.value,
  }
  await postData('/users', data = user);
}

function showSignUpMsg() {
  document.getElementById('sign_up_msg').classList.add('show_sign_up_msg');
}

document.addEventListener('DOMContentLoaded', function () {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('passwordInput');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;

      if (type === 'text') {
        togglePassword.src = 'assets/img/visibility_off.png';
      } else {
        togglePassword.src = 'assets/img/lock.png';
      }
    });
  }
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');

  if (toggleConfirmPassword && confirmPasswordInput) {
    toggleConfirmPassword.addEventListener('click', function () {
      const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
      confirmPasswordInput.type = type;

      if (type === 'text') {
        toggleConfirmPassword.src = 'assets/img/visibility_off.png';
      } else {
        toggleConfirmPassword.src = 'assets/img/lock.png';
      }
    });
  }
});