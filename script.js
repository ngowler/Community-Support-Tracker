const hamburgerMenu = document.getElementById('hamburgerMenuSVG')
let hamburgerMenuCount = 0
const navbar = document.getElementById('navbar')
let mediaQuery = window.matchMedia("(max-width: 700px")

function load() {
  hamburgerMenu.addEventListener('click', handleMenuClick);
  mediaQuery.addEventListener('change', () => handleMediaQuery(mediaQuery));
  handleMediaQuery(mediaQuery)
}

function handleMenuClick() {
  if (hamburgerMenuCount == 0) {
    hamburgerMenuCount++
    navbar.style.left = '0px';
  } else {
    hamburgerMenuCount = 0
    navbar.style.left = '-300px';
  }
}

// Code used from this website https://www.w3schools.com/howto/howto_js_media_queries.asp
function handleMediaQuery(mediaQuery) {
  if (mediaQuery.matches) {
    navbar.style.left = '-300px';
    hamburgerMenuCount = 0
  } else {
    navbar.style.left = '0px';
  }
}

load()