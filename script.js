


function load() {
  const donationSubmitButton = document.getElementById('donation-submit-button')

  const hamburgerMenu = document.getElementById("hamburgerMenuSVG");
  let hamburgerMenuCount = 0;
  const navbar = document.getElementById("navbar");
  let mediaQuery = window.matchMedia("(max-width: 700px");

  donationSubmitButton.addEventListener('click', (e) => validateForm(e))
  hamburgerMenu.addEventListener('click', handleMenuClick);
  mediaQuery.addEventListener('change', () => handleMediaQuery(mediaQuery));
  handleMediaQuery(mediaQuery)
}

// donationFormData = {}


function validateForm(e) {
  e.preventDefault()
  hideErrors();
  errorFlag = false

  const donationInputs = [
    'donation-charity-name-',
    'donation-amount-',
    'donation-date-',
    'donation-message-'
  ]

  donationFormData = {}

  donationInputs.forEach((input) => {
    if (!formHasInput(input)) {
      errorFlag = true
    }
  })

  donationAmountInputValue = document.getElementById('donation-amount-input').value

  let numberRegexp = new RegExp(/^[0-9]+$/)
  if (!numberRegexp.test(donationAmountInputValue)) {
    document.getElementById('donation-amount-error-wrapper').style.display = 'flex';
    errorFlag = true
  }

  if (!errorFlag) {
    donationFormData['charityName'] = document.getElementById('donation-charity-name-input').value
    donationFormData['donationAmount'] = donationAmountInputValue
    donationFormData['donationDate'] = document.getElementById('donation-date-input').value
    donationFormData['donationMessage'] = document.getElementById('donation-message-input').value
  }
}


function hideErrors() {
  document.getElementById('donation-charity-name-error-wrapper').style.display = 'none';
  document.getElementById('donation-amount-error-wrapper').style.display = 'none';
  document.getElementById('donation-date-error-wrapper').style.display = 'none';
  document.getElementById('donation-message-error-wrapper').style.display = 'none';
}

function formHasInput(input) {
  let inputElement = document.getElementById(input + 'input')
  

  if (inputElement.value !== '' && inputElement.value !== null) {
    return true
  } else {
    document.getElementById(input + 'error-wrapper').style.display = 'flex';
    return false
  }
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

if (typeof window !== "undefined") {
  window.onload = load;
} else {
  // CommonJS-style exports are used when in a Node.js environment
  module.exports = { validateForm, hideErrors, formHasInput };
}
