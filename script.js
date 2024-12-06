
function load() {
    
    // ====================================================== //
    // =================== VOLUNTEER CODE =================== //
    // ====================================================== //

    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
    innerVolunteerDoc.getElementById("volunteer-hours-form").addEventListener("submit", function(e) {
        e.preventDefault();
        validateVolunteerForm(e, localStorage);
    });
    selectStar();
    displayVolunteers(localStorage);

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

    let donationFrame = document.getElementById("donation-tracker-frame");
    let innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    const donationSubmitButton = innerDonationDoc.getElementById('donation-submit-button')
    donationSubmitButton.addEventListener('click', (e) => donationValidateForm(e))
}

// ========================================================================== //
// ========================================================================== //
// ============================= VOLUNTEER CODE ============================= //
// ========================================================================== //
// ========================================================================== //

function validateVolunteerForm(e, volunteers) {
    e.preventDefault();
    let volunteerStorage = volunteers || localStorage;

    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
    volunteerHideErrors();
    if(volunteerFormHasErrors()) {
        return
    } else {
        let volunteerDataArray = [];
        let curentVolunteerData = JSON.parse(volunteerStorage.getItem("volunteerData"));
        if(curentVolunteerData != null) {
            volunteerDataArray = curentVolunteerData;
        }
        let volunteerData = {};
        volunteerData.volunteerCharity = innerVolunteerDoc.getElementById("charity-name").value;
        volunteerData.volunteerHours = parseFloat(innerVolunteerDoc.getElementById("hours-volunteered").value);
        volunteerData.volunteerDate = innerVolunteerDoc.getElementById("volunteer-hours-date").value;
        volunteerData.volunteerRating = innerVolunteerDoc.getElementsByClassName("starsSelected").length;
        
        volunteerDataArray.push(volunteerData);

        volunteerStorage.setItem("volunteerData", JSON.stringify(volunteerDataArray));

        innerVolunteerDoc.getElementById("volunteer-hours-form").reset();
        resetStars();

        displayVolunteers(localStorage);
        calculateVolunteerHours(localStorage);
    }
}

function volunteerHideErrors() {
    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
    let errorFields = innerVolunteerDoc.getElementsByClassName("volunteer-form-error");
    for(let i=0; i<errorFields.length; i++) {
        errorFields[i].style.display = "none";
    }
}

function volunteerShowError(formField, errorId, errorFlag) {
    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
	innerVolunteerDoc.getElementById(errorId).style.display = "block";
	if(!errorFlag) {
		innerVolunteerDoc.getElementById(formField).focus();
		if(formField.type == "text") {
			innerVolunteerDoc.getElementById(formField).select();
		}
	}
}

function volunteerFormHasErrors() {
    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
    let errorFlag = false;
    let charityName = innerVolunteerDoc.getElementById("charity-name").value;
    if(charityName == "" || charityName == null) {
        volunteerShowError("charity-name", "charity-name_error", errorFlag);
        errorFlag=true;
    }
    let hoursVolunteered = innerVolunteerDoc.getElementById("hours-volunteered").value;
    if(hoursVolunteered < 0 || hoursVolunteered == "" || hoursVolunteered == null) {
        volunteerShowError("hours-volunteered", "hours-volunteered_error", errorFlag);
        errorFlag=true;
    }
    let volunteerDate = innerVolunteerDoc.getElementById("volunteer-hours-date").value;
    let today = new Date().toLocaleDateString();
    if(volunteerDate == "" || volunteerDate == null || volunteerDate > today) {
        volunteerShowError("volunteer-hours-date", "volunteer-hours-date_error", errorFlag);
        errorFlag=true;
    }
    let numberOfStars = innerVolunteerDoc.getElementsByClassName("starsSelected").length;
    if(numberOfStars == 0){
        volunteerShowError("volunteer-experience-rating", "volunteer-experience-rating_error", errorFlag);
        errorFlag=true;
    }
    return errorFlag;
}

function selectStar() {
    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
    let stars = Array.from(innerVolunteerDoc.getElementsByClassName("star"));
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
    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
    let stars = Array.from(innerVolunteerDoc.getElementsByClassName("star"));
    stars.forEach((star) => {
        star.classList.remove("starsSelected");
    });
}

function displayVolunteers(volunteers) {
    let volunteerStorage = volunteers || localStorage;

    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
    let tbody = innerVolunteerDoc.getElementById("volunteer-table-body");
    while(tbody.rows.length > 0) {
        tbody.deleteRow(0);
    }

    let volunteerDataArray = JSON.parse(volunteerStorage.getItem("volunteerData"));
    if(volunteerDataArray != null) {
        volunteerDataArray.forEach((volunteerData) => {
            let volunteerRecord = innerVolunteerDoc.createElement("tr");
            let volunteerCharity = innerVolunteerDoc.createElement("td");
            let volunteerHours = innerVolunteerDoc.createElement("td");
            let volunteerDate = innerVolunteerDoc.createElement("td");
            let volunteerRating = innerVolunteerDoc.createElement("td");
            let volunteerDeleteRow = innerVolunteerDoc.createElement("td");

            let volunteerDeleteRowButton = innerVolunteerDoc.createElement("button");
            volunteerDeleteRowButton.textContent = "Delete";
            volunteerDeleteRowButton.classList.add("delete-volunteer");

            volunteerCharity.textContent = volunteerData.volunteerCharity;
            volunteerHours.textContent = volunteerData.volunteerHours;
            volunteerDate.textContent = volunteerData.volunteerDate;
            volunteerRating.textContent = `${volunteerData.volunteerRating}/5`;
            volunteerDeleteRow.appendChild(volunteerDeleteRowButton);
            

            volunteerRecord.appendChild(volunteerCharity);
            volunteerRecord.appendChild(volunteerHours);
            volunteerRecord.appendChild(volunteerDate);
            volunteerRecord.appendChild(volunteerRating);
            volunteerRecord.appendChild(volunteerDeleteRow);

            tbody.appendChild(volunteerRecord);
        });
        removeVolunteer(localStorage);
        calculateVolunteerHours(localStorage);
    }
}

function removeVolunteer(volunteers) {
    let volunteerStorage = volunteers || localStorage;

    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
    let volunteerDataArray = JSON.parse(volunteerStorage.getItem("volunteerData"));
    let deleteVolunteerButtons = Array.from(innerVolunteerDoc.getElementsByClassName("delete-volunteer"));
    deleteVolunteerButtons.forEach((deleteVolunteer, index) => {
        deleteVolunteer.addEventListener("click", () => {
            volunteerDataArray.splice(index, 1);
            volunteerStorage.setItem("volunteerData", JSON.stringify(volunteerDataArray));
            displayVolunteers(localStorage);
            calculateVolunteerHours(localStorage);
        });
    });
}

function calculateVolunteerHours(volunteers) {
    let volunteerStorage = volunteers || localStorage;

    let volunteerFrame = document.getElementById("volunteer-hours-tracker");
    let innerVolunteerDoc =
        volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;
    let displayHoursMessage = innerVolunteerDoc.getElementById("display-total-hours");
    let volunteerDataArray = JSON.parse(volunteerStorage.getItem("volunteerData"));
    let hoursToDisplay = 0
    if(volunteerDataArray == null) {
        displayHoursMessage.textContent = "You have 0 volunteer hours."
    } else {
        volunteerDataArray.forEach((volunteerData) => {
            hoursToDisplay += volunteerData.volunteerHours
        });
        displayHoursMessage.textContent = `You have ${hoursToDisplay} volunteer hours.`
    }
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

function donationValidateForm(e, donations) {
  e.preventDefault()
  donationHideErrors();
  errorFlag = false

  let donationFrame = document.getElementById("donation-tracker-frame");
  let innerDonationDoc =
      donationFrame.contentDocument || donationFrame.contentWindow.document;

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

  donationCharityNameInputValue = innerDonationDoc.getElementById("donation-charity-name-input").value;
  donationAmountInputValue = innerDonationDoc.getElementById('donation-amount-input').value
  donationDateInputValue = innerDonationDoc.getElementById('donation-date-input').value
  donationMessageInputValue = innerDonationDoc.getElementById('donation-message-input').value

  let numberRegexp = new RegExp(/^[0-9]+$/)
  if (!numberRegexp.test(donationAmountInputValue)) {
    innerDonationDoc.getElementById('donation-amount-error-wrapper').style.display = 'flex';
    errorFlag = true
  }

  if (!errorFlag) {
    donationFormData['charityName'] = donationCharityNameInputValue
    donationFormData['donationAmount'] = donationAmountInputValue
    donationFormData['donationDate'] = donationDateInputValue
    donationFormData['donationMessage'] = donationMessageInputValue

    resetDonationTable()
    updateDonationLocalStorage(donationFormData)
    clearDonationForm()
    updateDonationTable();
    updateDonationSummary(donations)
  }
}


function donationHideErrors() {
  let donationFrame = document.getElementById("donation-tracker-frame");
  let innerDonationDoc =
      donationFrame.contentDocument || donationFrame.contentWindow.document;

  innerDonationDoc.getElementById('donation-charity-name-error-wrapper').style.display = 'none';
  innerDonationDoc.getElementById('donation-amount-error-wrapper').style.display = 'none';
  innerDonationDoc.getElementById('donation-date-error-wrapper').style.display = 'none';
  innerDonationDoc.getElementById('donation-message-error-wrapper').style.display = 'none';
}

function donationFormHasInput(input) {

  let donationFrame = document.getElementById("donation-tracker-frame");
  let innerDonationDoc =
      donationFrame.contentDocument || donationFrame.contentWindow.document;

  let inputElement = innerDonationDoc.getElementById(input + 'input')
  

  if (inputElement.value !== '' && inputElement.value !== null) {
    return true
  } else {
    innerDonationDoc.getElementById(input + 'error-wrapper').style.display = 'flex';
    return false
  }
}

function updateDonationTable(donations) {
    let donationStorage = donations || localStorage

    let donationFrame = document.getElementById("donation-tracker-frame");
    let innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;

    let donationTable = innerDonationDoc.getElementById('donation-table')

    if (donationStorage.donations) {
        let donations = JSON.parse(donationStorage.donations)
        for (let donation of donations) {
            let tableRow = innerDonationDoc.createElement('tr')
            let tableBody = innerDonationDoc.createElement('tbody')
            let { charityName, donationAmount, donationDate, donationMessage } = donation
            let [
                donationCharityNameData,
                donationAmountData,
                donationDateData,
                donationMessageData,
                donationDeleteRow ,
                donationDeleteButton
            ] = [
                innerDonationDoc.createElement('td'),
                innerDonationDoc.createElement('td'),
                innerDonationDoc.createElement('td'),
                innerDonationDoc.createElement('td'),
                innerDonationDoc.createElement('td'),
                innerDonationDoc.createElement('button')
            ]

            donationDeleteButton.innerHTML = 'Delete'
            donationDeleteButton.classList = 'donation-delete-button'
            donationDeleteButton.onclick = (e) => removeDonationRow(e)

            donationCharityNameData.innerHTML = charityName
            tableRow.appendChild(donationCharityNameData)

            donationAmountData.innerHTML = donationAmount
            tableRow.appendChild(donationAmountData)

            donationDateData.innerHTML = donationDate
            tableRow.appendChild(donationDateData)

            donationMessageData.innerHTML = donationMessage
            tableRow.appendChild(donationMessageData)

            donationDeleteRow.appendChild(donationDeleteButton)
            tableRow.appendChild(donationDeleteRow)
            donationDeleteRow.classList = 'donation-delete-button-td'

            // tableBody.appendChild(tableRow)

            donationTable.appendChild(tableRow)

        }
    } else {
        console.log('no donations :(')
    }
    
}

function clearDonationForm() {
    let donationFrame = document.getElementById("donation-tracker-frame");
    let innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    innerDonationDoc.getElementById('donation-charity-name-input').value = '';
    innerDonationDoc.getElementById('donation-amount-input').value = '';
    innerDonationDoc.getElementById('donation-date-input').value = '';
    innerDonationDoc.getElementById('donation-message-input').value = '';
}

function updateDonationLocalStorage(data) {
    if (localStorage.getItem('donations')) {
        let donations = JSON.parse(localStorage.getItem('donations'))
        let newDonations = [data]
        donations.forEach((obj) => {newDonations.push(obj)})
        localStorage.setItem('donations', JSON.stringify(newDonations))
    } else {
        let newDonations = [data]
        localStorage.setItem('donations', JSON.stringify(newDonations))
    }
}

function removeDonationRow(event, donations) {
    let donationStorage = donations || localStorage

    const button = event.currentTarget

    const donationLocalStorage = JSON.parse(donationStorage.donations)

    console.log(donationLocalStorage)

    // const newLocalStorage = oldLocalStorage.forEach(() => {})

    let tableRow = button.parentNode.parentNode
    let tableRowChildren = tableRow.children

    let currentDonation = {
        'charityName': tableRowChildren[0].innerText,
        'donationAmount': tableRowChildren[1].innerText,
        'donationDate': tableRowChildren[2].innerText,
        'donationMessage': tableRowChildren[3].innerText
    }


    const indexOfDonation = donationLocalStorage.findIndex(obj => {
        return (
            obj.charityName == currentDonation.charityName
            && obj.donationAmount == currentDonation.donationAmount
            && obj.donationDate == currentDonation.donationDate
            && obj.donationMessage == currentDonation.donationMessage
        )
    })

    donationLocalStorage.splice(indexOfDonation, 1)

    localStorage.setItem('donations', JSON.stringify(donationLocalStorage))


    button.parentNode.parentNode.parentNode.removeChild(button.parentNode.parentNode);

    updateDonationSummary(donationStorage)
}

function updateDonationSummary(donations) {
    let donationFrame = document.getElementById("donation-tracker-frame");
    let innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;

    let donationTextElement = innerDonationDoc.getElementById('donation-summary-text')

    let donationStorage = donations || localStorage

    let donationArray = JSON.parse(donationStorage.donations)

    let donationSum = 0
    for (let i=0; i < donationArray.length; i++) {
        donationSum += Number(donationArray[i].donationAmount)
    }

    console.log(donationSum)

    donationTextElement.innerText = `The total donation amount is: $${donationSum}`
}

function resetDonationTable() {
    let donationFrame = document.getElementById("donation-tracker-frame");
    let innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;

    let donationTable = innerDonationDoc.getElementById('donation-table')

    donationTable.innerHTML = `
    <tr>
        <th>Charity Name</th>
        <th>Donation Amount</th>
        <th>Donation Date</th>
        <th>Donor's Comment</th>
        <th>Delete a Donation</th>
    </tr> 
    `}


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
  module.exports = { donationValidateForm, donationHideErrors, donationFormHasInput, eventHandleSubmit, eventValidateForm, calculateVolunteerHours, removeVolunteer, displayVolunteers, validateVolunteerForm, volunteerHideErrors, volunteerShowError, volunteerFormHasErrors, selectStar, resetStars, load};
}