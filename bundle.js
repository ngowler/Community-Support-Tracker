(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function load() {
  const donationSubmitButton = document.getElementById('donation-submit-button')
  
  const donationInputs = [
    'donation-charity-name-',
    'donation-amount-',
    'donation-date-',
    'donation-message-'
  ]
  
  const donationFormData = {}
  donationSubmitButton.addEventListener('click', (e) => validateForm(e))
}


function validateForm(e) {

  hideErrors();
  errorFlag = false

  donationInputs.forEach((input) => {
    if (!formHasInput(input)) {
      errorFlag = true
    }
  })

  donationAmountInputValue = document.getElementById('donation-amount-input').value


  let numberRegexp = new RegExp(/^[0-9]+$/)
  if (!numberRegexp.test(donationAmountInputValue)) {
    donationAmountErrorWrapper.style.display = 'flex';
    errorFlag = true
  }

  if (!errorFlag) {
    donationFormData['charityName'] = document.getElementById('donation-charity-name-input').value
    donationFormData['donationAmount'] = donationAmountInputValue
    donationFormData['donationDate'] = document.getElementById('donation-date-input').value
    donationFormData['donationMessage'] = document.getElementById('donation-message-input').value
  }

  if (errorFlag) {
    e.preventDefault()
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

if (typeof window !== "undefined") {
  window.onload = load;
} else {
  // CommonJS-style exports are used when in a Node.js environment
  module.exports = { validateForm, hideErrors, formHasInput };
}
},{}]},{},[1]);
