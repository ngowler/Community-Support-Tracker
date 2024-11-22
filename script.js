const [
  donationSubmitButton,
  donationCharityErrorWrapper,
  donationAmountErrorWrapper,
  donationDateErrorWrapper,
  donationMessageErrorWrapper
] = [
  document.getElementById('donation-submit-button'),
  document.getElementById('donation-charity-error-wrapper'),
  document.getElementById('donation-amount-error-wrapper'),
  document.getElementById('donation-date-error-wrapper'),
  document.getElementById('donation-message-error-wrapper')
]

const inputs = [
  'donation-charity-input-name',
  'donation-amount-input',
  'donation-date-input',
  'donation-message-input'
]

function load() {
  document.addEventListener('click', (e) => validateForm(e))
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
}


function hideErrors() {
  donationCharityErrorWrapper.style.display = 'none';
  donationAmountErrorWrapper.style.display = 'none';
  donationDateErrorWrapper.style.display = 'none';
  donationMessageErrorWrapper.style.display = 'none';
}

function formHasInput(input) {
  let input = document.getElementById(input)

  if (input.value !== '' || input.value !== null) {
    return true
  } else {
    return false
  }
}