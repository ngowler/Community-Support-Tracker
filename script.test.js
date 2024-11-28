const { JSDOM } = require("jsdom")

const { donationValidateForm, donationHideErrors, donationFormHasInput, handleSubmit, validateForm } = require("./script")

test("to validate that the handleSubmit for submission works", () => {
    //purely for mocking a test user input for the form
    const dom = new JSDOM(`
        
        <form id="form">
            <input type="text" id="eventSignupName" name="event-signup-name-input" value="Gaming Event">
            <input type="text" id="repSignupName" name="company-rep-name-input" value="Sekiro">
            <input type="email" id="repEmail" name="company-rep-email-input" value="sekiro@example.com">
            <select name="role" id="companyRole" name="company-role-selection-input">
                <option value="Sponsor"></option>
                <option value="Participant">Participant</option>
                <option value="Organizer">Organizer</option>
            </select>
        </form>
    `);

    global.document = dom.window.document;
    global.window = dom.window;

    const eventFormNode = document.querySelector("#form");

    const handleSubmit = jest.fn();
    eventFormNode.addEventListener("submit", handleSubmit);
    eventFormNode.dispatchEvent(new dom.window.Event("submit"));

    expect(handleSubmit).toHaveBeenCalled(); 
});


// --FORM VALIDATION --
test('testing to validate empty inputs', () => {
    //initial setup for test
    const dom = new JSDOM(`
        <form id="form">
            <input type="text" id="event-signup-name-input" name="event-signup-name-input" value="Gaming Event">
            <input type="text" id="company-rep-name-input" name="company-rep-name-input" value="Sekiro">
            <input type="email" id="company-rep-email-input" name="company-rep-email-input" value="sekiro@example.com">
            <select name="role" id="company-role-selection-input">
                <option value=""></option>
                <option value="Sponsor"></option>
                <option value="Participant">Participant</option>
                <option value="Organizer">Organizer</option>
            </select>
            <div id="event-name-error-wrapper" style="display: none;"></div>
            <div id="company-rep-name-error-wrapper" style="display: none;"></div>
            <div id="company-rep-email-error-wrapper" style="display: none;"></div>
            <div id="company-role-selection-error-wrapper" style="display: none;"></div>
        </form> 
    `);
    global.document = dom.window.document;
    global.window = dom.window;

    document.getElementById("event-signup-name-input").value = '';
    document.getElementById("company-rep-name-input").value = '';
    document.getElementById("company-rep-email-input").value = '';
    document.getElementById("company-role-selection-input").value = '';


    //simulate validateForm working
    validateForm('', '', '');

    //Error Wrappers to be displayed
    expect(document.getElementById('event-name-error-wrapper').style.display).toBe('block');
    expect(document.getElementById('company-rep-name-error-wrapper').style.display).toBe('block');
    expect(document.getElementById('company-rep-email-error-wrapper').style.display).toBe('block');
    expect(document.getElementById('company-role-selection-error-wrapper').style.display).toBe('block');
});

// --EMAILS--
test('testing for invalid email formats', () => {
    //for invalid emails
    document.getElementById("company-rep-email-input").value = 'sekiro';
    validateForm('Gaming Event', 'Sekiro', 'sekiro');
    expect(document.getElementById('company-rep-email-error-wrapper').style.display).toBe('block');

    //for valid emails
    document.getElementById("company-rep-email-input").value = 'sekiro@example.com';
    validateForm('Event Name', 'Rep Name', 'sekiro@example.com');
    expect(document.getElementById('company-rep-email-error-wrapper').style.display).toBe('none');
});
    

test('testing to see if form is populated with valid data', () => {
    //filling in for valid data
    document.getElementById("event-signup-name-input").value = 'Gaming Event';
    document.getElementById("company-rep-name-input").value = 'Sekiro';
    document.getElementById("company-rep-email-input").value = 'sekiro@example.com';
    document.getElementById("company-role-selection-input").value = 'Sponsor';

    //mocking the event to simulate a browser working
    const mockEvent = { preventDefault: jest.fn() };
    const formData = handleSubmit(mockEvent);

    //confirming to have the right values
    expect(formData).toEqual({
        eventName: 'Gaming Event',
        representativeName: 'Sekiro',
        representativeEmail: 'sekiro@example.com',
        companyRole: 'Sponsor'
    });
});


test("donationValidateForm submits a form with valid inputs", () => {

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
  `);

    global.document = dom.window.document;

    const donationValidateForm = jest.fn()

    const form = document.getElementById('form')
    form.addEventListener('submit', donationValidateForm)
    form.dispatchEvent(new dom.window.Event('submit'))

    expect(donationValidateForm).toHaveBeenCalled();
})

test("donationHideErrors hides the charity error element.", () => {
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

  donationHideErrors();

  expect(document.getElementById('donation-charity-name-error-wrapper').style.display).toBe('none')
})

test("all error messages show when invalid inputs are given", () => {
    const dom = new JSDOM(`
    <!DOCTYPE html>
    <form id="form">
      <input id="donation-charity-name-input" value=""/>
      <input id="donation-amount-input" value=""/>
      <input id="donation-date-input" value=""/>
      <input id="donation-message-input" value=""/>

      <div id="donation-charity-name-error-wrapper"></div>
      <div id="donation-amount-error-wrapper"></div>
      <div id="donation-date-error-wrapper"></div>
      <div id="donation-message-error-wrapper"></div>
    </form>
  `);

    global.document = dom.window.document;


    const form = document.getElementById("form");
    form.addEventListener("submit", donationValidateForm);
    form.dispatchEvent(new dom.window.Event("submit"));
    
    expect(document.getElementById('donation-charity-name-error-wrapper').style.display).toBe('flex')
    expect(
        document.getElementById("donation-amount-error-wrapper").style
            .display
    ).toBe("flex");
    expect(
        document.getElementById("donation-date-error-wrapper").style
            .display
    ).toBe("flex");
    expect(
        document.getElementById("donation-message-error-wrapper").style
            .display
    ).toBe("flex");
    
});

test("all error messages show when invalid inputs are given and amount is not blank", () => {
    const dom = new JSDOM(`
    <!DOCTYPE html>
    <form id="form">
      <input id="donation-charity-name-input" value=""/>
      <input id="donation-amount-input" value="-100"/>
      <input id="donation-date-input" value=""/>
      <input id="donation-message-input" value=""/>

      <div id="donation-charity-name-error-wrapper"></div>
      <div id="donation-amount-error-wrapper"></div>
      <div id="donation-date-error-wrapper"></div>
      <div id="donation-message-error-wrapper"></div>
    </form>
  `);

    global.document = dom.window.document;

    const form = document.getElementById("form");
    form.addEventListener("submit", donationValidateForm);
    form.dispatchEvent(new dom.window.Event("submit"));

    expect(
        document.getElementById("donation-charity-name-error-wrapper").style
            .display
    ).toBe("flex");
    expect(
        document.getElementById("donation-amount-error-wrapper").style.display
    ).toBe("flex");
    expect(
        document.getElementById("donation-date-error-wrapper").style.display
    ).toBe("flex");
    expect(
        document.getElementById("donation-message-error-wrapper").style.display
    ).toBe("flex");
});

test("donationHideErrors hides the amount error element.", () => {
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

  donationHideErrors();

  expect(document.getElementById('donation-amount-error-wrapper').style.display).toBe('none')
})

test("donationHideErrors hides the date error element.", () => {
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

  donationHideErrors();

  expect(document.getElementById('donation-date-error-wrapper').style.display).toBe('none')
})

test("donationHideErrors hides the message error element.", () => {
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

  donationHideErrors();

  expect(document.getElementById('donation-message-error-wrapper').style.display).toBe('none')
})

test("donationFormHasInput returns true when a form has input.", () => {
  const dom = new JSDOM(`
      <!DOCTYPE html>
      <form id="test">
        <input id="test-input" value="something" />
      </form>
    `)

    global.document = dom.window.document;

    expect(donationFormHasInput('test-')).toBe(true)
})

test("donationFormHasInput returns false when a form doesn't have input.", () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <form id="test">
      <input id="test-input" />
      <div id="test-error-wrapper"></div>
    </form>
  `)

  global.document = dom.window.document;

  expect(donationFormHasInput('test-')).toBe(false)
})


test("donationFormData is populated", () => {
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

    // const form = document.getElementById('form')
    // form.addEventListener('submit', donationValidateForm)

    // Code used from this github page https://gist.github.com/blairg/b6575a23ce96603a120d841f70463f76
    // and these documents https://jestjs.io/docs/jest-object#jestspyonobject-methodname

    const preventDefaultListener = jest.fn();
    const mockEvent = {
        preventDefault: preventDefaultListener,
    };
    donationFormData = {}
    donationValidateForm(mockEvent);

    
    // Code used from this stack overflow post https://stackoverflow.com/questions/49044994/how-can-i-test-part-of-object-using-jest
    expect(donationFormData).toMatchObject({
      charityName: 'name',
      donationAmount: '100',
      donationDate: '2024-20-11',
      donationMessage: 'message'
    })
})
