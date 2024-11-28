
function load() {
    document.querySelector('.event-signup-form').addEventListener('submit', handleSubmit);
    hamburgerMenu.addEventListener('click', handleMenuClick);
    mediaQuery.addEventListener('change', () => handleMediaQuery(mediaQuery));
    handleMediaQuery(mediaQuery)
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

//to export for testing purposes
module.exports = { handleSubmit, validateForm };

const hamburgerMenu = document.getElementById('hamburgerMenuSVG')
let hamburgerMenuCount = 0
const navbar = document.getElementById('navbar')
let mediaQuery = window.matchMedia("(max-width: 700px")

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

