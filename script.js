
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
      await new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4) {
            if (this.status == 200) { elmnt.innerHTML = this.responseText; }
            if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
            elmnt.removeAttribute("w3-include-html");
            resolve();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
      });
      await includeHTML();
      return;
    }
  }
}

function setBGForCurrentNavItem(item) {
  let navItemRef = document.getElementById(item);
  navItemRef.style.background = 'rgba(9, 25, 49, 1)';

}