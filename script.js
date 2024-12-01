
function load() {
    
    // ====================================================== //
    // =================== VOLUNTEER CODE =================== //
    // ====================================================== //

    selectStar();
    window.frames["volunteer-hours-tracker"].contentDocument.getElementById("volunteer-hours-form").addEventListener("submit", validateVolunteerForm);

    // ====================================================== //
    // ================== EVENT SIGNUP CODE ================= //
    // ====================================================== //

    window.frames["event-signup"].contentDocument.getElementById('event-signup-form').addEventListener('submit', eventHandleSubmit);

    // ====================================================== //
    // ================ NAVIGATION MENU CODE ================ //
    // ====================================================== //

    const hamburgerMenu = document.getElementById("hamburgerMenuSVG");
    const navbar = document.getElementById("navbar");
    hamburgerMenu.addEventListener('click', handleMenuClick);
    let mediaQuery = window.matchMedia("(max-width: 700px");
    mediaQuery.addEventListener('change', () => handleMediaQuery(mediaQuery));
    handleMediaQuery(mediaQuery)
    let hamburgerMenuCount = 0;

    // ====================================================== //
    // ================ DONATION TRACKER CODE =============== //
    // ====================================================== //

    const donationSubmitButton = window.frames["donation-tracker"].contentDocument.getElementById('donation-submit-button')
    donationSubmitButton.addEventListener('click', (e) => donationValidateForm(e))
}

// ========================================================================== //
// ========================================================================== //
// ============================= VOLUNTEER CODE ============================= //
// ========================================================================== //
// ========================================================================== //

function validateVolunteerForm(e) {
    volunteerHideErrors();
    if(volunteerFormHasErrors()) {
        e.preventDefault();
    } else {
        let volunteerData = {};
        volunteerData.charityName = window.frames["volunteer-hours-tracker"].contentDocument.getElementById("charity-name").value;
        volunteerData.hoursVolunteered = parseFloat(window.frames["volunteer-hours-tracker"].contentDocument.getElementById("hours-volunteered").value);
        volunteerData.date = window.frames["volunteer-hours-tracker"].contentDocument.getElementById("volunteer-hours-date").value;
        volunteerData.stars = window.frames["volunteer-hours-tracker"].contentDocument.getElementsByClassName("starsSelected").length;
    }
}

function volunteerHideErrors() {
    let errorFields = window.frames["volunteer-hours-tracker"].contentDocument.getElementsByClassName("volunteer-form-error");
    for(let i=0; i<errorFields.length; i++) {
        errorFields[i].style.display = "none";
    }
}

function volunteerShowError(formField, errorId, errorFlag) {
	window.frames["volunteer-hours-tracker"].contentDocument.getElementById(errorId).style.display = "block";
	if(!errorFlag) {
		window.frames["volunteer-hours-tracker"].contentDocument.getElementById(formField).focus();
		if(formField.type == "text") {
			window.frames["volunteer-hours-tracker"].contentDocument.getElementById(formField).select();
		}
	}
}

function volunteerFormHasErrors() {
    let errorFlag = false;
    let charityName = window.frames["volunteer-hours-tracker"].contentDocument.getElementById("charity-name").value;
    if(charityName == "" || charityName == null) {
        volunteerShowError("charity-name", "charity-name_error", errorFlag);
        errorFlag=true;
    }
    let hoursVolunteered = window.frames["volunteer-hours-tracker"].contentDocument.getElementById("hours-volunteered").value;
    if(hoursVolunteered < 0 || hoursVolunteered == "" || hoursVolunteered == null) {
        volunteerShowError("hours-volunteered", "hours-volunteered_error", errorFlag);
        errorFlag=true;
    }
    let volunteerDate = window.frames["volunteer-hours-tracker"].contentDocument.getElementById("volunteer-hours-date").value;
    if(volunteerDate == "" || volunteerDate == null) {
        volunteerShowError("volunteer-hours-date", "volunteer-hours-date_error", errorFlag);
        errorFlag=true;
    }
    let numberOfStars = window.frames["volunteer-hours-tracker"].contentDocument.getElementsByClassName("starsSelected").length;
    if(numberOfStars == 0){
        volunteerShowError("volunteer-experience-rating", "volunteer-experience-rating_error", errorFlag);
        errorFlag=true;
    }
    return errorFlag;
}

function selectStar() {
    const stars = Array.from(window.frames["volunteer-hours-tracker"].contentDocument.getElementsByClassName("star"));
    stars.forEach((star) => {
        star.addEventListener("click", () => {
            resetStars();
            for(i=0; i<star.value; i++) {
                stars[i].classList.add("starsSelected");
            }
        });
    });
}

function resetStars() {
    const stars = Array.from(window.frames["volunteer-hours-tracker"].contentDocument.getElementsByClassName("star"));
    stars.forEach((star) => {
        star.classList.remove("starsSelected");
    });
}


// ========================================================================== //
// ========================================================================== //
// ============================ EVENT SIGNUP CODE =========================== //
// ========================================================================== //
// ========================================================================== //

function eventHandleSubmit(event) {
    event.preventDefault();

    let eventSignupName = window.frames["event-signup"].contentDocument.getElementById('event-signup-name-input').value;
    let repSignupName = window.frames["event-signup"].contentDocument.getElementById('company-rep-name-input').value;
    let repEmail = window.frames["event-signup"].contentDocument.getElementById('company-rep-email-input').value;
    let companyRole = window.frames["event-signup"].contentDocument.getElementById('company-role-selection-input').value;

    if (eventValidateForm(eventSignupName, repSignupName, repEmail, companyRole)) {
        let formData = {
            eventName: eventSignupName,
            representativeName: repSignupName,
            representativeEmail: repEmail,
            companyRole: companyRole
        };

        console.log('Form data:', formData);
        eventClearForm();
        return formData;
    }
}

//VALIDATION
function eventValidateForm(eventName, repName, repEmail, companyRole) {
    let isValid = true;

    if (!eventName.trim()) {
        window.frames["event-signup"].contentDocument.getElementById('event-name-error-wrapper').style.display = 'flex';
        isValid = false;
    } else {
        window.frames["event-signup"].contentDocument.getElementById('event-name-error-wrapper').style.display = 'none';
    }

    if (!repName.trim()) {
        window.frames["event-signup"].contentDocument.getElementById('company-rep-name-error-wrapper').style.display = 'flex';
        isValid = false;
    } else {
        window.frames["event-signup"].contentDocument.getElementById('company-rep-name-error-wrapper').style.display = 'none';
    }

    if (!isValidEmail(repEmail)) {
        window.frames["event-signup"].contentDocument.getElementById('company-rep-email-error-wrapper').style.display = 'flex';
        isValid = false;
    } else {
        window.frames["event-signup"].contentDocument.getElementById('company-rep-email-error-wrapper').style.display = 'none';
    }

    if (!companyRole || !companyRole.trim()) {
        window.frames["event-signup"].contentDocument.getElementById('company-role-selection-error-wrapper').style.display = 'flex';
        isValid = false;
    } else {
        window.frames["event-signup"].contentDocument.getElementById('company-role-selection-error-wrapper').style.display = 'none';
    }

    return isValid;
}

function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function eventClearForm() {
    window.frames["event-signup"].contentDocument.getElementById('event-signup-name-input').value = '';
    window.frames["event-signup"].contentDocument.getElementById('company-rep-name-input').value = '';
    window.frames["event-signup"].contentDocument.getElementById('company-rep-email-input').value = '';
    window.frames["event-signup"].contentDocument.getElementById('company-role-selection-input').selectedIndex = 0;
}

// ========================================================================== //
// ========================================================================== //
// ========================== DONATION TRACKER CODE ========================= //
// ========================================================================== //
// ========================================================================== //

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

  donationAmountInputValue = window.frames["donation-tracker"].contentDocument.getElementById('donation-amount-input').value

  let numberRegexp = new RegExp(/^[0-9]+$/)
  if (!numberRegexp.test(donationAmountInputValue)) {
    window.frames["donation-tracker"].contentDocument.getElementById('donation-amount-error-wrapper').style.display = 'flex';
    errorFlag = true
  }

  if (!errorFlag) {
    donationFormData['charityName'] = window.frames["donation-tracker"].contentDocument.getElementById('donation-charity-name-input').value
    donationFormData['donationAmount'] = donationAmountInputValue
    donationFormData['donationDate'] = window.frames["donation-tracker"].contentDocument.getElementById('donation-date-input').value
    donationFormData['donationMessage'] = window.frames["donation-tracker"].contentDocument.getElementById('donation-message-input').value
  }
}


function donationHideErrors() {
  window.frames["donation-tracker"].contentDocument.getElementById('donation-charity-name-error-wrapper').style.display = 'none';
  window.frames["donation-tracker"].contentDocument.getElementById('donation-amount-error-wrapper').style.display = 'none';
  window.frames["donation-tracker"].contentDocument.getElementById('donation-date-error-wrapper').style.display = 'none';
  window.frames["donation-tracker"].contentDocument.getElementById('donation-message-error-wrapper').style.display = 'none';
}

function donationFormHasInput(input) {
  let inputElement = window.frames["donation-tracker"].contentDocument.getElementById(input + 'input')
  

  if (inputElement.value !== '' && inputElement.value !== null) {
    return true
  } else {
    window.frames["donation-tracker"].contentDocument.getElementById(input + 'error-wrapper').style.display = 'flex';
    return false
  }
}


// ========================================================================== //
// ========================================================================== //
// ========================== NAVIGATION MENU CODE ========================== //
// ========================================================================== //
// ========================================================================== //


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
async function handleMediaQuery(mediaQuery) {
  if (mediaQuery.matches) {
    
    navbar.style.left = '-300px';
    hamburgerMenuCount = 0
    setTimeout(() => {
        navbar.style.transition = "0.5s"
    }, 500)
  } else {
    navbar.style.transition = "left 0s"
    navbar.style.left = '0px';
  }
}


// ========================================================================== //
// ========================================================================== //
// =========================== EXPORTS FOR TESTING ========================== //
// ========================================================================== //
// ========================================================================== //


if (typeof window !== "undefined") {

    window.onload = load;

} else {
  // CommonJS-style exports are used when in a Node.js environment
  module.exports = { donationValidateForm, donationHideErrors, donationFormHasInput, eventHandleSubmit, eventValidateForm, validateVolunteerForm, volunteerHideErrors, volunteerShowError, volunteerFormHasErrors, selectStar, resetStars, load};
}