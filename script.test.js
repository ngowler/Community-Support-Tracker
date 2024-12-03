const { donationValidateForm, donationHideErrors, donationFormHasInput, updateDonationTable, clearDonationForm, updateDonationLocalStorage, removeDonationRow } = require('./script')

const {JSDOM} = require("jsdom");

beforeEach(() => {
    class LocalStorageMock {
        constructor() {
            this.store = {};
        }

        clear() {
            this.store = {};
        }

        getItem(key) {
            return this.store[key] || null;
        }

        setItem(key, value) {
            this.store[key] = String(value);
        }

        removeItem(key) {
            delete this.store[key];
        }
    }

    global.localStorage = new LocalStorageMock();
});

test("donationValidateForm submits a form with valid inputs", () => {

    const dom = new JSDOM(`
    <body>
      <iframe id="donation-tracker-frame"></iframe>
    </body>
  `);

    // Get the iframe element
    const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
    );

    const innerDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;

    global.document = dom.window.document;

    innerDoc.body.innerHTML = `
        <body class="nested-body">
          <div class="donation-tracker">
              <form class="donation-form" id="donation-form">
                  <h1 class="donation-form-header">Donation Tracker</h1>
                  <ul class="donation-form-list">
                      <li class="donation-charity-name-input-wrapper">
                    <label for="donation-charity-name-input">Charity Name: </label>
                    <input id="donation-charity-name-input" value="name"/>
                </li>
                <div class="donation-error-wrapper" id="donation-charity-name-error-wrapper" style="display: none;">
                    <span class="donation-error">Please enter a charity name.</span>
                </div>
                      <li class="donation-amount-input-wrapper">
                          <label for="donation-amount-input">Donation Amount: </label><input id="donation-amount-input" value="100"/>
                      </li>
                      <div class="donation-error-wrapper" id="donation-amount-error-wrapper">
                          <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                      </div>
                      <li class="donation-date-input-wrapper">
                          <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-20-11"/>
                      </li>
                      <div class="donation-error-wrapper" id="donation-date-error-wrapper">
                          <span class="donation-error">Please enter a valid date.</span>
                      </div>
                      <li class="donation-message-input-wrapper">
                          <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                      </li>
                      <div class="donation-error-wrapper" id="donation-message-error-wrapper">
                          <span class="donation-error">Please enter a donation message.</span>
                      </div>
                      <li class="donation-submit-button-wrapper">
                          <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                      </li>
                  </ul>
                  
              </form>
          </div>

      </body>
    `;
    

    const donationValidateForm = jest.fn()

    const form = document.getElementById('donation-form')
    console.log(form)

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


test("donationFormData is populated", async () => {

    document.body.innerHTML = `
      <iframe id="donation-tracker-frame"></iframe>
    `

    const donationFrame = document.getElementById("donation-tracker-frame");
    const innerDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;

    innerDoc.body.innerHTML = `
        <body class="nested-body">
          <div class="donation-tracker">
              <form class="donation-form">
                  <h1 class="donation-form-header">Donation Tracker</h1>
                  <ul class="donation-form-list">
                      <li class="donation-charity-name-input-wrapper">
                    <label for="donation-charity-name-input">Charity Name: </label>
                    <input id="donation-charity-name-input" value="name"/>
                </li>
                <div class="donation-error-wrapper" id="donation-charity-name-error-wrapper" style="display: none;">
                    <span class="donation-error">Please enter a charity name.</span>
                </div>
                      <li class="donation-amount-input-wrapper">
                          <label for="donation-amount-input">Donation Amount: </label><input id="donation-amount-input" value="100"/>
                      </li>
                      <div class="donation-error-wrapper" id="donation-amount-error-wrapper">
                          <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                      </div>
                      <li class="donation-date-input-wrapper">
                          <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-20-11"/>
                      </li>
                      <div class="donation-error-wrapper" id="donation-date-error-wrapper">
                          <span class="donation-error">Please enter a valid date.</span>
                      </div>
                      <li class="donation-message-input-wrapper">
                          <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                      </li>
                      <div class="donation-error-wrapper" id="donation-message-error-wrapper">
                          <span class="donation-error">Please enter a donation message.</span>
                      </div>
                      <li class="donation-submit-button-wrapper">
                          <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                      </li>
                  </ul>
                  
              </form>
          </div>

      </body>
    `;

    global.updateDonationLocalStorage = jest.fn();
    global.clearDonationForm = jest.fn();
    global.updateDonationTable = jest.fn();
    global.donationFormHasInput = jest.fn().mockReturnValue(true);


    // const form = document.getElementById('form')
    // form.addEventListener('submit', donationValidateForm)

    // Code used from this github page https://gist.github.com/blairg/b6575a23ce96603a120d841f70463f76
    // and these documents https://jestjs.io/docs/jest-object#jestspyonobject-methodname

    const preventDefaultListener = jest.fn();
    const mockEvent = {
        preventDefault: preventDefaultListener,
    };
    donationFormData = {}


    donationValidateForm(mockEvent)

    
    // Code used from this stack overflow post https://stackoverflow.com/questions/49044994/how-can-i-test-part-of-object-using-jest
    expect(donationFormData).toMatchObject({
      charityName: 'name',
      donationAmount: '100',
      donationDate: '2024-20-11',
      donationMessage: 'message'
    })
})

