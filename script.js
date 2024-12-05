
function load() {
    
    // ====================================================== //
    // =================== VOLUNTEER CODE =================== //
    // ====================================================== //

    selectStar();
    window.frames["volunteer-hours-tracker"].contentDocument.getElementById("volunteer-hours-form").addEventListener("submit", validateVolunteerForm);

    // ====================================================== //
    // ================== EVENT SIGNUP CODE ================= //
    // ====================================================== //

    let eventFrame = document.getElementById("event-signup");
    let innerEventDoc =
        eventFrame.contentDocument || eventFrame.contentWindow.document;

    innerEventDoc.getElementById('event-signup-form').addEventListener('submit', eventHandleSubmit);

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

    let eventFrame = document.getElementById("event-signup");
    let innerEventDoc =
        eventFrame.contentDocument || eventFrame.contentWindow.document;

    let eventSignupName = innerEventDoc.getElementById('event-signup-name-input').value;
    let repSignupName = innerEventDoc.getElementById('company-rep-name-input').value;
    let repEmail = innerEventDoc.getElementById('company-rep-email-input').value;
    let companyRole = innerEventDoc.getElementById('company-role-selection-input').value;

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
    let eventFrame = document.getElementById("event-signup");
    let innerEventDoc =
        eventFrame.contentDocument || eventFrame.contentWindow.document;
    let isValid = true;

    if (!eventName.trim()) {
        innerEventDoc.getElementById('event-name-error-wrapper').style.display = 'flex';
        isValid = false;
    } else {
        innerEventDoc.getElementById('event-name-error-wrapper').style.display = 'none';
    }

    if (!repName.trim()) {
        innerEventDoc.getElementById('company-rep-name-error-wrapper').style.display = 'flex';
        isValid = false;
    } else {
        innerEventDoc.getElementById('company-rep-name-error-wrapper').style.display = 'none';
    }

    if (!isValidEmail(repEmail)) {
        innerEventDoc.getElementById('company-rep-email-error-wrapper').style.display = 'flex';
        isValid = false;
    } else {
        innerEventDoc.getElementById('company-rep-email-error-wrapper').style.display = 'none';
    }

    if (!companyRole || !companyRole.trim()) {
        innerEventDoc.getElementById('company-role-selection-error-wrapper').style.display = 'flex';
        isValid = false;
    } else {
        innerEventDoc.getElementById('company-role-selection-error-wrapper').style.display = 'none';
    }

    return isValid;

}

function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function eventClearForm() {
    let eventFrame = document.getElementById("event-signup");
    let innerEventDoc =
        eventFrame.contentDocument || eventFrame.contentWindow.document;
    innerEventDoc.getElementById('event-signup-name-input').value = '';
    innerEventDoc.getElementById('company-rep-name-input').value = '';
    innerEventDoc.getElementById('company-rep-email-input').value = '';
    innerEventDoc.getElementById('company-role-selection-input').selectedIndex = 0;

    updateEventLocalStorage()
    updateEventTable()

    
}

//TABLES
function updateEventTable(events) {
  let eventStorage = events || localStorage

  let eventFrame = document.getElementById("event-signup");
  let innerEventDoc =
      eventFrame.contentDocument || eventFrame.contentWindow.document;

  let eventTable = innerDonationDoc.getElementById('signup-table')

  if (donationStorage.donations) {
      let events = JSON.parse(eventStorage.events)
      for (let event of events) {
          let tableRow = innerDonationDoc.createElement('tr')
          let tableBody = innerDonationDoc.createElement('tbody')
          let { eventSignupName, repSignupName, repEmail, companyRole } = event
          let [
              eventSignupNameData,
              repSignupNameData,
              repEmailData,
              companyRoleData,
              eventDeleteRow ,
              eventDeleteButton
          ] = [
              innerEventDoc.createElement('td'),
              innerEventDoc.createElement('td'),
              innerEventDoc.createElement('td'),
              innerEventDoc.createElement('td'),
              innerEventDoc.createElement('td'),
              innerEventDoc.createElement('button')
          ]

          eventDeleteButton.innerHTML = 'Delete'
          eventDeleteButton.classList = 'event-delete-button'
          eventDeleteButton.onclick = (e) => removeEventRow(e)

          eventSignupNameData.innerHTML = eventSignupName
          tableRow.appendChild(eventSignupNameData)

          repSignupNameData.innerHTML = repSignupName
          tableRow.appendChild(repSignupNameData)

          repEmailData.innerHTML = repEmail
          tableRow.appendChild(repEmailData)

          companyRoleData.innerHTML = companyRole
          tableRow.appendChild(companyRoleData)

          eventDeleteRow.appendChild(eventDeleteButton)
          tableRow.appendChild(eventDeleteRow)
          eventDeleteRow.classList = 'event-delete-button-td'

          // tableBody.appendChild(tableRow)

          eventTable.appendChild(tableRow)

      }
  } else {
      console.log('no current event signups')
  }
  
}

function updateEventLocalStorage(data) {
  if (localStorage.getItem('events')) {
      let events = JSON.parse(localStorage.getItem('events'))
      let newEvents = [data]
      events.forEach((obj) => {newEvents.push(obj)})
      localStorage.setItem('donations', JSON.stringify(newEvents))
  } else {
      let newEvents = [data]
      localStorage.setItem('events', JSON.stringify(newEvents))
  }
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