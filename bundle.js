(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){



function load() {
    document.querySelector('.event-signup-form').addEventListener('submit', handleSubmit);
    hamburgerMenu.addEventListener('click', handleMenuClick);
    mediaQuery.addEventListener('change', () => handleMediaQuery(mediaQuery));
    handleMediaQuery(mediaQuery)
    const hamburgerMenu = document.getElementById("hamburgerMenuSVG");
    let hamburgerMenuCount = 0;
    const navbar = document.getElementById("navbar");
    let mediaQuery = window.matchMedia("(max-width: 700px");
  
    const donationSubmitButton = document.getElementById('donation-submit-button')

    donationSubmitButton.addEventListener('click', (e) => donationValidateForm(e))
}

function handleSubmit(event) {
    event.preventDefault();

    let eventSignupName = document.getElementById('event-signup-name-input').value;
    let repSignupName = document.getElementById('company-rep-name-input').value;
    let repEmail = document.getElementById('company-rep-email-input').value;
    let companyRole = document.getElementById('company-role-selection-input').value;

    if (validateForm(eventSignupName, repSignupName, repEmail, companyRole)) {
        let formData = {
            eventName: eventSignupName,
            representativeName: repSignupName,
            representativeEmail: repEmail,
            companyRole: companyRole
        };

        console.log('Form data:', formData);
        clearForm();
        return formData;
    }
}

//VALIDATION
function validateForm(eventName, repName, repEmail, companyRole) {
    let isValid = true;

    if (!eventName.trim()) {
        document.getElementById('event-name-error-wrapper').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('event-name-error-wrapper').style.display = 'none';
    }

    if (!repName.trim()) {
        document.getElementById('company-rep-name-error-wrapper').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('company-rep-name-error-wrapper').style.display = 'none';
    }

    if (!isValidEmail(repEmail)) {
        document.getElementById('company-rep-email-error-wrapper').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('company-rep-email-error-wrapper').style.display = 'none';
    }

    if (!companyRole || !companyRole.trim()) {
        document.getElementById('company-role-selection-error-wrapper').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('company-role-selection-error-wrapper').style.display = 'none';
    }

    return isValid;
}

function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function clearForm() {
    document.getElementById('event-signup-name-input').value = '';
    document.getElementById('company-rep-name-input').value = '';
    document.getElementById('company-rep-email-input').value = '';
    document.getElementById('company-role-selection-input').selectedIndex = 0;
}



// donationFormData = {}


function donationValidateForm(e) {
  e.preventDefault()
  donationHideErrors();
  errorFlag = false

  const donationInputs = [
    'donation-charity-name-',
    'donation-amount-',
    'donation-date-',
    'donation-message-'
  ]

  donationFormData = {}

  donationInputs.forEach((input) => {
    if (!donationFormHasInput(input)) {
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


function donationHideErrors() {
  document.getElementById('donation-charity-name-error-wrapper').style.display = 'none';
  document.getElementById('donation-amount-error-wrapper').style.display = 'none';
  document.getElementById('donation-date-error-wrapper').style.display = 'none';
  document.getElementById('donation-message-error-wrapper').style.display = 'none';
}

function donationFormHasInput(input) {
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
  module.exports = { donationValidateForm, donationHideErrors, donationFormHasInput, handleSubmit, validateForm };
}



},{}]},{},[1]);
