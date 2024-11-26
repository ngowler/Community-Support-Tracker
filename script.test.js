const { JSDOM } = require("jsdom")
const { validateForm, hideErrors, formHasInput } = require("./script")


test("validateForm submits a form with valid inputs", () => {
  const date = new Date()

  const dom = new JSDOM(`
    <!DOCTYPE html>
    <form id="form">
      <input id="donation-charity-name-input" value="name"/>
      <input id="donation-amount-input" value="100"/>
      <input id="donation-date-input" value="2024-20-11"/>
      <input id="donation-message-input" value="message"/>

      <div id="donation-charity-name-error-wrapper"></div>
      <div id="donation-amount-error-wrapper"></div>
      <div id="donation-date-error-wrapper"></div>
      <div id="donation-message-error-wrapper"></div>
    </form>
  `)

  global.document = dom.window.document;

  const preventDefaultListener = jest.fn();
  const mockEvent = {
    preventDefault: preventDefaultListener,
  };

  // const form = document.getElementById('form')

  // form.addEventListener('submit', validateForm)

  // const mockSubmit = new Event('submit')

  // form.dispatchEvent(mockSubmit)

  validateForm(mockEvent)

  expect(preventDefaultListener).not.toHaveBeenCalled()

  


})

test("hideErrors hides the charity error element.", () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <form id="test">
      <div id="donation-charity-name-error-wrapper"></div>
      <div id="donation-amount-error-wrapper"></div>
      <div id="donation-date-error-wrapper"></div>
      <div id="donation-message-error-wrapper"></div>
    </form>
  `)

  global.document = dom.window.document;

  hideErrors();

  expect(document.getElementById('donation-charity-name-error-wrapper').style.display).toBe('none')
})

test("hideErrors hides the amount error element.", () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <form id="test">
      <div id="donation-charity-name-error-wrapper"></div>
      <div id="donation-amount-error-wrapper"></div>
      <div id="donation-date-error-wrapper"></div>
      <div id="donation-message-error-wrapper"></div>
    </form>
  `)

  global.document = dom.window.document;

  hideErrors();

  expect(document.getElementById('donation-amount-error-wrapper').style.display).toBe('none')
})

test("hideErrors hides the date error element.", () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <form id="test">
      <div id="donation-charity-name-error-wrapper"></div>
      <div id="donation-amount-error-wrapper"></div>
      <div id="donation-date-error-wrapper"></div>
      <div id="donation-message-error-wrapper"></div>
    </form>
  `)

  global.document = dom.window.document;

  hideErrors();

  expect(document.getElementById('donation-date-error-wrapper').style.display).toBe('none')
})

test("hideErrors hides the message error element.", () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <form id="test">
      <div id="donation-charity-name-error-wrapper"></div>
      <div id="donation-amount-error-wrapper"></div>
      <div id="donation-date-error-wrapper"></div>
      <div id="donation-message-error-wrapper"></div>
    </form>
  `)

  global.document = dom.window.document;

  hideErrors();

  expect(document.getElementById('donation-message-error-wrapper').style.display).toBe('none')
})

test("formHasInput returns true when a form has input.", () => {
  const dom = new JSDOM(`
      <!DOCTYPE html>
      <form id="test">
        <input id="test-input" value="something" />
      </form>
    `)

    global.document = dom.window.document;

    expect(formHasInput('test-')).toBe(true)
})

test("formHasInput returns false when a form doesn't have input.", () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <form id="test">
      <input id="test-input" />
      <div id="test-error-wrapper"></div>
    </form>
  `)

  global.document = dom.window.document;

  expect(formHasInput('test-')).toBe(false)
})