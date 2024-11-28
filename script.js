function load() {
    document.querySelector('.event-signup-form').addEventListener('submit', handleSubmit);
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