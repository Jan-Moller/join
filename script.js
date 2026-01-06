let BASE_URL = "https://join-4afa9-default-rtdb.europe-west1.firebasedatabase.app/"
async function init(item) {
  await includeHTML();
  setBGForCurrentNavItem(item)
}

async function includeHTML() {
  var z, i, elmnt, file;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      try {
        await new Promise((resolve, reject) => {
          const xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
              if (this.status == 200) {
                elmnt.innerHTML = this.responseText;
              }
              if (this.status == 404) {
                elmnt.innerHTML = "Page not found.";
              }
              elmnt.removeAttribute("w3-include-html");
              resolve();
            }
          }
          xhttp.onerror = function () {
            reject(new Error('Request failed'));
          }
          xhttp.open("GET", file, true);
          xhttp.send();
        });
        await includeHTML();
        return;
      } catch (error) {
        console.error('Error loading HTML:', error);
      }
    }
  }
}

function setBGForCurrentNavItem(item) {
  let navItemRef = document.getElementById(item);
  navItemRef.style.background = 'rgba(9, 25, 49, 1)';
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

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

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
  errorMsg.style.display='block';


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

