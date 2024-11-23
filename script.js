const [
  donationSubmitButton,
  donationCharityErrorWrapper,
  donationAmountErrorWrapper,
  donationDateErrorWrapper,
  donationMessageErrorWrapper,
  donationAmountError
] = [
  document.getElementById('donation-submit-button'),
  document.getElementById('donation-charity-name-error-wrapper'),
  document.getElementById('donation-amount-error-wrapper'),
  document.getElementById('donation-date-error-wrapper'),
  document.getElementById('donation-message-error-wrapper'),
  document.getElementById('donation-amount-error')
]

const inputs = [
  'donation-charity-name-',
  'donation-amount-',
  'donation-date-',
  'donation-message-'
]

const formData = {}

function load() {
  donationSubmitButton.addEventListener('click', (e) => validateForm(e))
}


function validateForm(e) {
  e.preventDefault()

  hideErrors();
  errorFlag = false

  inputs.forEach((input) => {
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
    formData['charityName'] = document.getElementById('donation-charity-name-input').value
    formData['donationAmount'] = donationAmountInputValue
    formData['donationDate'] = document.getElementById('donation-date-input').value
    formData['donationMessage'] = document.getElementById('donation-message-input').value
    console.log(formData)
  }
}


function hideErrors() {
  donationCharityErrorWrapper.style.display = 'none';
  donationAmountErrorWrapper.style.display = 'none';
  donationDateErrorWrapper.style.display = 'none';
  donationMessageErrorWrapper.style.display = 'none';
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
