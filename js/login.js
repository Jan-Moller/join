async function login() {
    let email = document.getElementById('login_mail').value;
    let password = document.getElementById('login_password').value;

    let response = await fetch(BASE_URL + 'users.json?orderBy="mail"&equalTo="' + email + '"');
    let matchingUsers = await response.json();

    if (matchingUsers && Object.keys(matchingUsers).length > 0) {
        let userKey = Object.keys(matchingUsers)[0];
        let user = matchingUsers[userKey];
        
        user.password === password ? window.location.href = 'summary.html': showLoginError();
    } else {
        showLoginError();
    }
}

function showLoginError() {
    document.getElementById('login_error_msg').style.display='block';
    document.getElementById('login_password').classList.add('wrong_password')
}