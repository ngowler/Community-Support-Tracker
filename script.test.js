const {
  donationValidateForm,
  donationHideErrors,
  donationFormHasInput,
  updateDonationTable,
  clearDonationForm,
  updateDonationLocalStorage,
  removeDonationRow,
  resetDonationTable,
  updateDonationSummary
} = require("./script");

const { JSDOM } = require("jsdom");

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
        this.store[key] = value;
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

  const donationFrame = dom.window.document.getElementById(
    "donation-tracker-frame"
  );

  const innerDonationDoc =
    donationFrame.contentDocument || donationFrame.contentWindow.document;

  global.document = dom.window.document;

  innerDonationDoc.body.innerHTML = `
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
                        <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                            <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                        </div>
                        <li class="donation-date-input-wrapper">
                            <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-20-11"/>
                        </li>
                        <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                            <span class="donation-error">Please enter a valid date.</span>
                        </div>
                        <li class="donation-message-input-wrapper">
                            <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                        </li>
                        <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
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

    

  const donationValidateForm = jest.fn();

  const form = innerDonationDoc.getElementById("donation-form");

  form.addEventListener("submit", donationValidateForm);
  form.dispatchEvent(new dom.window.Event("submit"));

  expect(donationValidateForm).toHaveBeenCalled();
});

test("donationHideErrors hides the charity error element.", () => {
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-20-11"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
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

  global.document = dom.window.document;

  donationHideErrors();

  expect(
    innerDonationDoc.getElementById("donation-charity-name-error-wrapper").style.display
  ).toBe("none");
});

test("all error messages show when invalid inputs are given", () => {
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
            <body class="nested-body">
                <div class="donation-tracker">
                    <form class="donation-form" id="donation-form">
                        <h1 class="donation-form-header">Donation Tracker</h1>
                        <ul class="donation-form-list">
                            <li class="donation-charity-name-input-wrapper">
                                <label for="donation-charity-name-input">Charity Name: </label>
                                <input id="donation-charity-name-input" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-charity-name-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a charity name.</span>
                            </div>
                            <li class="donation-amount-input-wrapper">
                                <label for="donation-amount-input">Donation Amount: </label><input id="donation-amount-input" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
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

  global.document = dom.window.document;

  const form = innerDonationDoc.getElementById("donation-form");
  form.addEventListener("submit", donationValidateForm);
  form.dispatchEvent(new dom.window.Event("submit"));

  expect(
    innerDonationDoc.getElementById("donation-charity-name-error-wrapper").style.display
  ).toBe("flex");
  expect(
    innerDonationDoc.getElementById("donation-amount-error-wrapper").style.display
  ).toBe("flex");
  expect(
    innerDonationDoc.getElementById("donation-date-error-wrapper").style.display
  ).toBe("flex");
  expect(
    innerDonationDoc.getElementById("donation-message-error-wrapper").style.display
  ).toBe("flex");
});

test("all error messages show when invalid inputs are given and amount is not blank", () => {
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
            <body class="nested-body">
                <div class="donation-tracker">
                    <form class="donation-form" id="donation-form">
                        <h1 class="donation-form-header">Donation Tracker</h1>
                        <ul class="donation-form-list">
                            <li class="donation-charity-name-input-wrapper">
                                <label for="donation-charity-name-input">Charity Name: </label>
                                <input id="donation-charity-name-input" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-charity-name-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a charity name.</span>
                            </div>
                            <li class="donation-amount-input-wrapper">
                                <label for="donation-amount-input">Donation Amount: </label><input id="donation-amount-input" value="one hundred"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
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

  global.document = dom.window.document;

  const form = innerDonationDoc.getElementById("donation-form");
  form.addEventListener("submit", donationValidateForm);
  form.dispatchEvent(new dom.window.Event("submit"));

  expect(
    innerDonationDoc.getElementById("donation-charity-name-error-wrapper").style.display
  ).toBe("flex");
  expect(
    innerDonationDoc.getElementById("donation-amount-error-wrapper").style.display
  ).toBe("flex");
  expect(
    innerDonationDoc.getElementById("donation-date-error-wrapper").style.display
  ).toBe("flex");
  expect(
    innerDonationDoc.getElementById("donation-message-error-wrapper").style.display
  ).toBe("flex");
});

test("donationHideErrors hides all error elements.", () => {
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-20-11"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
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

  global.document = dom.window.document;

  donationHideErrors();

  expect(innerDonationDoc.getElementById('donation-charity-name-error-wrapper').style.display).toBe('none')
  expect(
    innerDonationDoc.getElementById("donation-amount-error-wrapper").style.display
  ).toBe("none");
  expect(innerDonationDoc.getElementById('donation-date-error-wrapper').style.display).toBe('none')
  expect(innerDonationDoc.getElementById('donation-message-error-wrapper').style.display).toBe('none')
});


test("donationFormHasInput returns true when a form has input.", () => {
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
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

  global.document = dom.window.document;

  expect(donationFormHasInput("donation-charity-name-")).toBe(true);
  expect(donationFormHasInput('donation-amount-')).toBe(true)
  expect(donationFormHasInput('donation-date-')).toBe(true)
  expect(donationFormHasInput('donation-message-')).toBe(true)
});

test("donationFormHasInput returns false when a form doesn't have input.", () => {
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
            <body class="nested-body">
                <div class="donation-tracker">
                    <form class="donation-form" id="donation-form">
                        <h1 class="donation-form-header">Donation Tracker</h1>
                        <ul class="donation-form-list">
                            <li class="donation-charity-name-input-wrapper">
                                <label for="donation-charity-name-input">Charity Name: </label>
                                <input id="donation-charity-name-input" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-charity-name-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a charity name.</span>
                            </div>
                            <li class="donation-amount-input-wrapper">
                                <label for="donation-amount-input">Donation Amount: </label><input id="donation-amount-input" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value=""/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
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

  global.document = dom.window.document;

  expect(donationFormHasInput("donation-charity-name-")).toBe(false);
  expect(donationFormHasInput('donation-amount-')).toBe(false);
  expect(donationFormHasInput('donation-date-')).toBe(false);
  expect(donationFormHasInput('donation-message-')).toBe(false);
});

test("donationFormData is populated", () => {
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a donation message.</span>
                            </div>
                            <li class="donation-submit-button-wrapper">
                                <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                            </li>
                        </ul>
                        
                    </form>
                </div>
                <div class="donation-table-wrapper" id="donation-table-wrapper">
                    <h1 class="donation-form-header">Previous Donations</h1>
                    <table id="donation-table" class="donation-table">
                        <tbody>
                            <tr>
                                <th>Charity Name</th>
                                <th>Donation Amount</th>
                                <th>Donation Date</th>
                                <th>Donor's Comment</th>
                                <th>Delete a Donation</th>
                            </tr> 
                        </tbody>
                    </table>
                    <div class="donation-summary-wrapper" id="donation-summary-wrapper">
                        <p id="donation-summary-text" class="donation-summary-text"></p>
                    </div>
                </div>
    
          </body>
        `;


  const submitEvent = { preventDefault: jest.fn() };
  donationValidateForm(submitEvent, global.localStorage.store);

  // Code used from this stack overflow post https://stackoverflow.com/questions/49044994/how-can-i-test-part-of-object-using-jest
  expect(donationFormData).toMatchObject({
    charityName: 'name',
    donationAmount: '100',
    donationDate: '2024-11-20',
    donationMessage: 'message',
  });
});

test('donationFormData is correctly stored in localStorage', () => {
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a donation message.</span>
                            </div>
                            <li class="donation-submit-button-wrapper">
                                <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                            </li>
                        </ul>
                        
                    </form>
                </div>
                <div class="donation-table-wrapper" id="donation-table-wrapper">
                    <h1 class="donation-form-header">Previous Donations</h1>
                    <table id="donation-table" class="donation-table">
                        <tbody>
                            <tr>
                                <th>Charity Name</th>
                                <th>Donation Amount</th>
                                <th>Donation Date</th>
                                <th>Donor's Comment</th>
                                <th>Delete a Donation</th>
                            </tr> 
                        </tbody>
                    </table>
                    <div class="donation-summary-wrapper" id="donation-summary-wrapper">
                        <p id="donation-summary-text" class="donation-summary-text"></p>
                    </div>
                </div>
    
          </body>
        `;
    
  const submitEvent = { preventDefault: jest.fn() };
  donationValidateForm(submitEvent, global.localStorage.store);

  const storedDonationFormData = JSON.parse(localStorage.getItem('donations'))

  expect(storedDonationFormData).toEqual([{
    charityName: 'name',
    donationAmount: '100',
    donationDate: '2024-11-20',
    donationMessage: 'message',
  }])
    
})

test('donation-table is populated with localStorage data', async () => {
    global.localStorage.removeItem('donations')
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a donation message.</span>
                            </div>
                            <li class="donation-submit-button-wrapper">
                                <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                            </li>
                        </ul>
                        
                    </form>
                </div>

                <div class="donation-table-wrapper" id="donation-table-wrapper">
                    <h1 class="donation-form-header">Previous Donations</h1>
                    <table id="donation-table" class="donation-table">
                        <tbody>
                            <tr>
                                <th>Charity Name</th>
                                <th>Donation Amount</th>
                                <th>Donation Date</th>
                                <th>Donor's Comment</th>
                                <th>Delete a Donation</th>
                            </tr> 
                        </tbody>
                    </table>
                </div>
    
          </body>

        `;
      
    global.localStorage.setItem('donations', JSON.stringify([{
        charityName: 'name',
        donationAmount: '100',
        donationDate: '2024-11-20',
        donationMessage: 'message',
    }]))

    await updateDonationTable(global.localStorage.store);

    const donationTable = innerDonationDoc.getElementById('donation-table');

    const tableRows = donationTable.getElementsByTagName('tr');

    expect(tableRows.length).toBe(2)
    expect(tableRows[1].children[0].textContent).toBe('name');
    expect(tableRows[1].children[1].textContent).toBe('100');
    expect(tableRows[1].children[2].textContent).toBe('2024-11-20');
    expect(tableRows[1].children[3].textContent).toBe('message');
})

test('donationSummary is correctly calculated', () => {
    global.localStorage.removeItem('donations')
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a donation message.</span>
                            </div>
                            <li class="donation-submit-button-wrapper">
                                <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                            </li>
                        </ul>
                        
                    </form>
                </div>

                <div class="donation-table-wrapper" id="donation-table-wrapper">
                    <h1 class="donation-form-header">Previous Donations</h1>
                    <table id="donation-table" class="donation-table">
                        <tbody>
                            <tr>
                                <th>Charity Name</th>
                                <th>Donation Amount</th>
                                <th>Donation Date</th>
                                <th>Donor's Comment</th>
                                <th>Delete a Donation</th>
                            </tr> 
                        </tbody>
                    </table>
                    <div class="donation-summary-wrapper" id="donation-summary-wrapper">
                        <p id="donation-summary-text" class="donation-summary-text"></p>
                    </div>
                </div>
    
          </body>

        `;
    

    global.localStorage.setItem('donations', JSON.stringify([
        {
            charityName: 'name',
            donationAmount: '100',
            donationDate: '2024-11-20',
            donationMessage: 'message',
        },
        {
            charityName: 'name2',
            donationAmount: '1000',
            donationDate: '2024-10-20',
            donationMessage: 'message2',
        }
    ]))

    

    const donationTable = innerDonationDoc.getElementById('donation-table');
    const tableRows = donationTable.getElementsByTagName('tr');

    updateDonationSummary(global.localStorage.store)

    expect(innerDonationDoc.getElementById('donation-summary-text').innerText).toBe('The total donation amount is: $1100')
})

test('resetDonationTable correctly resets the donation-table table to just the headers.', () => {
    global.localStorage.removeItem('donations')
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a donation message.</span>
                            </div>
                            <li class="donation-submit-button-wrapper">
                                <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                            </li>
                        </ul>
                        
                    </form>
                </div>

                <div class="donation-table-wrapper" id="donation-table-wrapper">
                    <h1 class="donation-form-header">Previous Donations</h1>
                    <table id="donation-table" class="donation-table">
                        <tbody>
                            <tr>
                                <th>Charity Name</th>
                                <th>Donation Amount</th>
                                <th>Donation Date</th>
                                <th>Donor's Comment</th>
                                <th>Delete a Donation</th>
                            </tr> 
                        </tbody>
                        <tr>
                            <td>liuzhdg</td>
                            <td>10</td>
                            <td>2024-11-24</td>
                            <td>sdf</td>
                            <td class="donation-delete-button-td"><button class="donation-delete-button">Delete</button></td>
                        </tr>
                        
                    </table>
                    <div class="donation-summary-wrapper" id="donation-summary-wrapper">
                        <p id="donation-summary-text" class="donation-summary-text"></p>
                    </div>
                </div>
    
          </body>

        `;


    global.localStorage.setItem('donations', JSON.stringify([
        {
            charityName: 'name',
            donationAmount: '100',
            donationDate: '2024-11-20',
            donationMessage: 'message',
        },
        {
            charityName: 'name2',
            donationAmount: '1000',
            donationDate: '2024-10-20',
            donationMessage: 'message2',
        }
    ]))

    

    const donationTable = innerDonationDoc.getElementById('donation-table');
    const tableRows = donationTable.getElementsByTagName('tr');

    resetDonationTable();


    expect(donationTable.innerHTML).toBe(`
    <tbody><tr>
        <th>Charity Name</th>
        <th>Donation Amount</th>
        <th>Donation Date</th>
        <th>Donor's Comment</th>
        <th>Delete a Donation</th>
    </tr> 
    </tbody>`)
})

test('removeDonationRow removes a row from the donation-table', () => {
    global.localStorage.removeItem('donations')
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a donation message.</span>
                            </div>
                            <li class="donation-submit-button-wrapper">
                                <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                            </li>
                        </ul>
                        
                    </form>
                </div>

                <div class="donation-table-wrapper" id="donation-table-wrapper">
                    <h1 class="donation-form-header">Previous Donations</h1>
                    <table id="donation-table" class="donation-table">
                        <tbody>
                            <tr>
                                <th>Charity Name</th>
                                <th>Donation Amount</th>
                                <th>Donation Date</th>
                                <th>Donor's Comment</th>
                                <th>Delete a Donation</th>
                            </tr> 
                        </tbody>
                        <tr>
                            <td>name</td>
                            <td>100</td>
                            <td>2024-11-20</td>
                            <td>message</td>
                            <td class="donation-delete-button-td"><button class="donation-delete-button">Delete</button></td>
                        </tr>
                        <tr>
                            <td>name2</td>
                            <td>1000</td>
                            <td>2024-10-20</td>
                            <td>message2</td>
                            <td class="donation-delete-button-td"><button class="donation-delete-button" id="test-button">Delete</button></td>
                        </tr>
                    </table>
                    <div class="donation-summary-wrapper" id="donation-summary-wrapper">
                        <p id="donation-summary-text" class="donation-summary-text"></p>
                    </div>
                </div>
    
          </body>

        `;
    

    global.localStorage.setItem('donations', JSON.stringify([
        {
            charityName: 'name',
            donationAmount: '100',
            donationDate: '2024-11-20',
            donationMessage: 'message',
        },
        {
            charityName: 'name2',
            donationAmount: '1000',
            donationDate: '2024-10-20',
            donationMessage: 'message2',
        }
    ]))

    let testButton = innerDonationDoc.getElementById('test-button')
    testButton.addEventListener('click', (e) => {removeDonationRow(e, global.localStorage.store)})

    testButton.click()

    const donationTable = innerDonationDoc.getElementById('donation-table');
    const tableRows = donationTable.getElementsByTagName('tr');

    expect(tableRows.length).toBe(2)

    
})

test('removeDonationRow removes a row from localStorage', () => {
    global.localStorage.removeItem('donations')
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a donation message.</span>
                            </div>
                            <li class="donation-submit-button-wrapper">
                                <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                            </li>
                        </ul>
                        
                    </form>
                </div>

                <div class="donation-table-wrapper" id="donation-table-wrapper">
                    <h1 class="donation-form-header">Previous Donations</h1>
                    <table id="donation-table" class="donation-table">
                        <tbody>
                            <tr>
                                <th>Charity Name</th>
                                <th>Donation Amount</th>
                                <th>Donation Date</th>
                                <th>Donor's Comment</th>
                                <th>Delete a Donation</th>
                            </tr> 
                        </tbody>
                        <tr>
                            <td>name</td>
                            <td>100</td>
                            <td>2024-11-20</td>
                            <td>message</td>
                            <td class="donation-delete-button-td"><button class="donation-delete-button">Delete</button></td>
                        </tr>
                        <tr>
                            <td>name2</td>
                            <td>1000</td>
                            <td>2024-10-20</td>
                            <td>message2</td>
                            <td class="donation-delete-button-td"><button class="donation-delete-button" id="test-button">Delete</button></td>
                        </tr>
                    </table>
                    <div class="donation-summary-wrapper" id="donation-summary-wrapper">
                        <p id="donation-summary-text" class="donation-summary-text"></p>
                    </div>
                </div>
    
          </body>

        `;
    

    global.localStorage.setItem('donations', JSON.stringify([
        {
            charityName: 'name',
            donationAmount: '100',
            donationDate: '2024-11-20',
            donationMessage: 'message',
        },
        {
            charityName: 'name2',
            donationAmount: '1000',
            donationDate: '2024-10-20',
            donationMessage: 'message2',
        }
    ]))

    let testButton = innerDonationDoc.getElementById('test-button')
    testButton.addEventListener('click', (e) => {removeDonationRow(e, global.localStorage.store)})

    testButton.click()


    expect(JSON.parse(global.localStorage.store.donations)).toEqual([{
        charityName: 'name',
        donationAmount: '100',
        donationDate: '2024-11-20',
        donationMessage: 'message',
    }])

    
})

test('donation-summary-text is updated when a record is removed from the table', () => {
    global.localStorage.removeItem('donations')
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a donation message.</span>
                            </div>
                            <li class="donation-submit-button-wrapper">
                                <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                            </li>
                        </ul>
                        
                    </form>
                </div>

                <div class="donation-table-wrapper" id="donation-table-wrapper">
                    <h1 class="donation-form-header">Previous Donations</h1>
                    <table id="donation-table" class="donation-table">
                        <tbody>
                            <tr>
                                <th>Charity Name</th>
                                <th>Donation Amount</th>
                                <th>Donation Date</th>
                                <th>Donor's Comment</th>
                                <th>Delete a Donation</th>
                            </tr> 
                        </tbody>
                        <tr>
                            <td>name</td>
                            <td>100</td>
                            <td>2024-11-20</td>
                            <td>message</td>
                            <td class="donation-delete-button-td"><button class="donation-delete-button">Delete</button></td>
                        </tr>
                        <tr>
                            <td>name2</td>
                            <td>1000</td>
                            <td>2024-10-20</td>
                            <td>message2</td>
                            <td class="donation-delete-button-td"><button class="donation-delete-button" id="test-button">Delete</button></td>
                        </tr>
                    </table>
                    <div class="donation-summary-wrapper" id="donation-summary-wrapper">
                        <p id="donation-summary-text" class="donation-summary-text"></p>
                    </div>
                </div>
    
          </body>

        `;
    

    global.localStorage.setItem('donations', JSON.stringify([
        {
            charityName: 'name',
            donationAmount: '100',
            donationDate: '2024-11-20',
            donationMessage: 'message',
        },
        {
            charityName: 'name2',
            donationAmount: '1000',
            donationDate: '2024-10-20',
            donationMessage: 'message2',
        }
    ]))

    

    let testButton = innerDonationDoc.getElementById('test-button')
    testButton.addEventListener('click', (e) => {removeDonationRow(e, global.localStorage.store)})

    testButton.click()

    expect(innerDonationDoc.getElementById('donation-summary-text').innerText).toBe('The total donation amount is: $100')

    
})

test('clearDonationForm resets all inputs in the form', () => {
    global.localStorage.removeItem('donations')
    const dom = new JSDOM(`
        <body>
          <iframe id="donation-tracker-frame"></iframe>
        </body>
      `);
    
      const donationFrame = dom.window.document.getElementById(
        "donation-tracker-frame"
      );
    
      const innerDonationDoc =
        donationFrame.contentDocument || donationFrame.contentWindow.document;
    
      global.document = dom.window.document;
    
      innerDonationDoc.body.innerHTML = `
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
                            <div class="donation-error-wrapper" id="donation-amount-error-wrapper" style="display: none;">
                                <span class="donation-error" id="donation-amount-error">Please enter a valid number.</span>
                            </div>
                            <li class="donation-date-input-wrapper">
                                <label for="donation-date-input">Donation Date: </label><input id="donation-date-input" type="date" value="2024-11-20"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-date-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a valid date.</span>
                            </div>
                            <li class="donation-message-input-wrapper">
                                <label for="donation-message-input">Donation Message: </label><input id="donation-message-input" value="message"/>
                            </li>
                            <div class="donation-error-wrapper" id="donation-message-error-wrapper" style="display: none;">
                                <span class="donation-error">Please enter a donation message.</span>
                            </div>
                            <li class="donation-submit-button-wrapper">
                                <button type="submit" id="donation-submit-button" class="donation-submit-button">Submit</button>
                            </li>
                        </ul>
                        
                    </form>
                </div>

                <div class="donation-table-wrapper" id="donation-table-wrapper">
                    <h1 class="donation-form-header">Previous Donations</h1>
                    <table id="donation-table" class="donation-table">
                        <tbody>
                            <tr>
                                <th>Charity Name</th>
                                <th>Donation Amount</th>
                                <th>Donation Date</th>
                                <th>Donor's Comment</th>
                                <th>Delete a Donation</th>
                            </tr> 
                        </tbody>
                        <tr>
                            <td>name</td>
                            <td>100</td>
                            <td>2024-11-20</td>
                            <td>message</td>
                            <td class="donation-delete-button-td"><button class="donation-delete-button">Delete</button></td>
                        </tr>
                        <tr>
                            <td>name2</td>
                            <td>1000</td>
                            <td>2024-10-20</td>
                            <td>message2</td>
                            <td class="donation-delete-button-td"><button class="donation-delete-button" id="test-button">Delete</button></td>
                        </tr>
                    </table>
                    <div class="donation-summary-wrapper" id="donation-summary-wrapper">
                        <p id="donation-summary-text" class="donation-summary-text"></p>
                    </div>
                </div>
    
          </body>

        `;
    clearDonationForm()

    let donationNameValue = innerDonationDoc.getElementById('donation-charity-name-input').value
    let donationAmountValue = innerDonationDoc.getElementById('donation-amount-input').value
    let donationDateValue = innerDonationDoc.getElementById('donation-date-input').value
    let donationMessageValue = innerDonationDoc.getElementById('donation-message-input').value

    expect(donationNameValue).toBe('')
    expect(donationAmountValue).toBe('')
    expect(donationDateValue).toBe('')
    expect(donationMessageValue).toBe('')

    
})