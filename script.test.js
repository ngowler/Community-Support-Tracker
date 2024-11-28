const { JSDOM } = require("jsdom")
const { handleSubmit, validateForm } = require("./script")

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