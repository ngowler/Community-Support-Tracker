const [
  donationSubmitButton,
  donationCharityErrorWrapper,
  donationAmountErrorWrapper,
  donationDateErrorWrapper,
  donationMessageErrorWrapper
] = [
  document.getElementById('donation-submit-button'),
  document.getElementById('donation-charity-name-error-wrapper'),
  document.getElementById('donation-amount-error-wrapper'),
  document.getElementById('donation-date-error-wrapper'),
  document.getElementById('donation-message-error-wrapper')
]

const inputs = [
  'donation-charity-name-',
  'donation-amount-',
  'donation-date-',
  'donation-message-'
]

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


}


function hideErrors() {
  donationCharityErrorWrapper.style.display = 'none';
  donationAmountErrorWrapper.style.display = 'none';
  donationDateErrorWrapper.style.display = 'none';
  donationMessageErrorWrapper.style.display = 'none';
}

function formHasInput(input) {
  let inputElement = document.getElementById(input + 'input')
  console.log(inputElement.value)

  if (inputElement.value !== '' && inputElement.value !== null) {
    return true
  } else {
    document.getElementById(input + 'error-wrapper').style.display = 'flex';
    return false
  }
}
