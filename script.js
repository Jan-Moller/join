let BASE_URL = "https://join-4afa9-default-rtdb.europe-west1.firebasedatabase.app/";

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

async function getData(path = "") {
  let response = await fetch(BASE_URL + path + ".json")
  return responseToJson = await response.json();
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}



