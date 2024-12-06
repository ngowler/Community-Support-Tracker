
const {JSDOM} = require("jsdom");

const {
  eventHandleSubmit,
  eventValidateForm,
  calculateVolunteerHours,
  removeVolunteer,
  displayVolunteers,
  validateVolunteerForm,
  volunteerHideErrors,
  volunteerShowError,
  volunteerFormHasErrors,
  selectStar,
  resetStars,
  load,
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

const mockValidateVolunteerForm = jest.fn(validateVolunteerForm);

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

test("validateVolunteerForm is triggered on form submission",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <form id="volunteer-hours-form">
            <input type="text" id="charity-name"/>
            <input type="number" id="hours-volunteered"/>
            <input type="date" id="volunteer-hours-date"/>
            <ul id="volunteer-experience-rating">
                <li class="star" value="1">&#9733;</li>
                <li class="star" value="2">&#9733;</li>
                <li class="star" value="3">&#9733;</li>
                <li class="star" value="4">&#9733;</li>
                <li class="star" value="5">&#9733;</li>
            </ul> 
            <span class="volunteer-form-error" id="charity-name_error"></span>
            <span class="volunteer-form-error" id="hours-volunteered_error"></span>
            <span class="volunteer-form-error" id="volunteer-hours-date_error"></span>
            <span class="volunteer-form-error" id="volunteer-experience-rating_error"></span>
        </form> 
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    expect(mockValidateVolunteerForm).toHaveBeenCalled();
});

test("validateVolunteerForm correctly collects form data",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <form id="volunteer-hours-form">
            <input type="text" id="charity-name" value="My Charity"/>
            <input type="number" id="hours-volunteered" value="4"/>
            <input type="date" id="volunteer-hours-date" value="2024-11-01"/>
            <ul id="volunteer-experience-rating">
                <li class="star starSelected" value="1">&#9733;</li>
                <li class="star starSelected" value="2">&#9733;</li>
                <li class="star starSelected" value="3">&#9733;</li>
                <li class="star starSelected" value="4">&#9733;</li>
                <li class="star starSelected" value="5">&#9733;</li>
            </ul> 
            <span class="volunteer-form-error" id="charity-name_error"></span>
            <span class="volunteer-form-error" id="hours-volunteered_error"></span>
            <span class="volunteer-form-error" id="volunteer-hours-date_error"></span>
            <span class="volunteer-form-error" id="volunteer-experience-rating_error"></span>
        </form> 
    `;
    
    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    volunteerData = {
        charityName: "My Charity",
        hoursVolunteered: 4,
        date: "2024-11-01",
        stars: 5
    }

    expect(innerVolunteerDoc.getElementById("charity-name").value).toBe(volunteerData.charityName);
    expect(parseFloat(innerVolunteerDoc.getElementById("hours-volunteered").value)).toBe(volunteerData.hoursVolunteered);
    expect(innerVolunteerDoc.getElementById("volunteer-hours-date").value).toBe(volunteerData.date);
    expect(innerVolunteerDoc.getElementsByClassName("starSelected").length).toBe(volunteerData.stars);
});

test("validateVolunteerForm correctly flags empty inputs",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <form id="volunteer-hours-form">
            <input type="text" id="charity-name"/>
            <input type="number" id="hours-volunteered"/>
            <input type="date" id="volunteer-hours-date"/>
            <ul id="volunteer-experience-rating">
                <li class="star" value="1">&#9733;</li>
                <li class="star" value="2">&#9733;</li>
                <li class="star" value="3">&#9733;</li>
                <li class="star" value="4">&#9733;</li>
                <li class="star" value="5">&#9733;</li>
            </ul> 
            <span class="volunteer-form-error" id="charity-name_error"></span>
            <span class="volunteer-form-error" id="hours-volunteered_error"></span>
            <span class="volunteer-form-error" id="volunteer-hours-date_error"></span>
            <span class="volunteer-form-error" id="volunteer-experience-rating_error"></span>
        </form> 
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    expect(volunteerFormHasErrors()).toBe(true);
});

test("validateVolunteerForm validates incorect number input",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <form id="volunteer-hours-form">
            <input type="text" id="charity-name"/>
            <input type="number" id="hours-volunteered"/>
            <input type="date" id="volunteer-hours-date"/>
            <ul id="volunteer-experience-rating">
                <li class="star" value="1">&#9733;</li>
                <li class="star" value="2">&#9733;</li>
                <li class="star" value="3">&#9733;</li>
                <li class="star" value="4">&#9733;</li>
                <li class="star" value="5">&#9733;</li>
            </ul> 
            <span class="volunteer-form-error" id="charity-name_error"></span>
            <span class="volunteer-form-error" id="hours-volunteered_error"></span>
            <span class="volunteer-form-error" id="volunteer-hours-date_error"></span>
            <span class="volunteer-form-error" id="volunteer-experience-rating_error"></span>
        </form> 
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    innerVolunteerDoc.getElementById("charity-name").value = "My Charity";
    innerVolunteerDoc.getElementById("hours-volunteered").value = "-4";
    innerVolunteerDoc.getElementById("volunteer-hours-date").value = "2024-11-01";
    innerVolunteerDoc.querySelectorAll(".star").forEach(star => star.classList.add("starsSelected"));
    expect(volunteerFormHasErrors()).toBe(true);
});

test("validateVolunteerForm validates incorect star input",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <form id="volunteer-hours-form">
            <input type="text" id="charity-name"/>
            <input type="number" id="hours-volunteered"/>
            <input type="date" id="volunteer-hours-date"/>
            <ul id="volunteer-experience-rating">
                <li class="star" value="1">&#9733;</li>
                <li class="star" value="2">&#9733;</li>
                <li class="star" value="3">&#9733;</li>
                <li class="star" value="4">&#9733;</li>
                <li class="star" value="5">&#9733;</li>
            </ul> 
            <span class="volunteer-form-error" id="charity-name_error"></span>
            <span class="volunteer-form-error" id="hours-volunteered_error"></span>
            <span class="volunteer-form-error" id="volunteer-hours-date_error"></span>
            <span class="volunteer-form-error" id="volunteer-experience-rating_error"></span>
        </form> 
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    innerVolunteerDoc.getElementById("charity-name").value = "My Charity";
    innerVolunteerDoc.getElementById("hours-volunteered").value = "4";
    innerVolunteerDoc.getElementById("volunteer-hours-date").value = "2024-11-01";
    innerVolunteerDoc.querySelectorAll(".star").forEach(star => star.classList.remove("starsSelected"));

    expect(volunteerFormHasErrors()).toBe(true);
});

test("validateVolunteerForm correctly populates temporary data object",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <form id="volunteer-hours-form">
            <input type="text" id="charity-name" value="My Charity"/>
            <input type="number" id="hours-volunteered" value="4"/>
            <input type="date" id="volunteer-hours-date" value="2024-11-01"/>
            <ul id="volunteer-experience-rating">
                <li class="star starSelected" value="1">&#9733;</li>
                <li class="star starSelected" value="2">&#9733;</li>
                <li class="star starSelected" value="3">&#9733;</li>
                <li class="star starSelected" value="4">&#9733;</li>
                <li class="star starSelected" value="5">&#9733;</li>
            </ul> 
            <span class="volunteer-form-error" id="charity-name_error"></span>
            <span class="volunteer-form-error" id="hours-volunteered_error"></span>
            <span class="volunteer-form-error" id="volunteer-hours-date_error"></span>
            <span class="volunteer-form-error" id="volunteer-experience-rating_error"></span>
        </form> 
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    expect(volunteerData.charityName).toBe("My Charity");
    expect(volunteerData.hoursVolunteered).toBe(4);
    expect(volunteerData.date).toBe("2024-11-01");
    expect(volunteerData.stars).toBe(5);
});

test("volunteer data is correctly stored in localStorage",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <body class="nested-body">
        <div class="volunteer-hours-tracker" id="volunteer-hours-tracker">
            <div id="volunteer-hours-form-wrapper">
                <form class="volunteer-hours-form" id="volunteer-hours-form">
                    <h1 class="volunteer-hours-header">Volunteer Hours Tracker</h1>
                    <div class="charity-name">
                        <div class="input-container">
                            <label for="charity-name">Charity Name:</label>
                            <input type="text" id="charity-name" name="charity-name" maxlength="50" value="My Charity" />
                        </div>
                        <span class="volunteer-form-error" id="charity-name_error">
                            * Please enter the name of the charity.
                        </span>
                    </div>

                    <div class="hours-volunteered">
                        <div class="input-container">
                            <label for="hours-volunteered">Hours Volunteered:</label>
                            <input type="number" id="hours-volunteered" name="hours-volunteered" maxlength="2" value="4" />					
                        </div>
                        <span class="volunteer-form-error" id="hours-volunteered_error">
                            * Please enter the hours spent volunteering.
                        </span>
                    </div>

                    <div class="volunteer-hours-date">
                        <div class="input-container">
                            <label for="volunteer-hours-date">Date:</label>
                            <input type="date" id="volunteer-hours-date" name="volunteer-hours-date" value="2024-11-01"/>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-hours-date_error">
                            * Please enter the date when the volunteering occurred.
                        </span>
                    </div>

                    <div class="volunteer-experience-rating">
                        <div class="input-container">
                            <label for="volunteer-experience-rating">Experience Rating:</label>
                            <ul id="volunteer-experience-rating" name="volunteer-experience-rating">
                                <li class="star starsSelected" value="1">&#9733;</li>
                                <li class="star starsSelected" value="2">&#9733;</li>
                                <li class="star starsSelected" value="3">&#9733;</li>
                                <li class="star starsSelected" value="4">&#9733;</li>
                                <li class="star starsSelected" value="5">&#9733;</li>
                            </ul>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-experience-rating_error">
                            * Please give a star rating of your experience.
                        </span>
                    </div>

                    <div class="volunteer-form-buttons">
                        <button type="submit" id="submit-volunteer-form">Submit</button>
                    </div>
                </form>
            </div>

            <div class="volunteer-table-container">
                <table class="volunteer-table">
                    <thead>
                        <tr>
                            <th>Charity</th>
                            <th>Hours</th>
                            <th>Date</th>
                            <th>Rating</th>
                            <th>Delete Row</th>
                        </tr>
                    </thead>
                    <tbody id="volunteer-table-body"></tbody>
                </table>

                <div id="volunteer-hours-calculator">
                    <p id="display-total-hours">You have no volunteer hours.</p>
                </div>
            </div>
            <!-- <script src="bundle.js"></script> -->
            <!-- Script file to automatically adjust the size of iframes if they change 
            Code used was written by Jacob Filipp and retrieved from https://jacobfilipp.com/iframe-height-autoresize-crossdomain/ -->
        </div>
    </body>
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", function(event) {
        validateVolunteerForm(event, localStorage);
    });
    form.dispatchEvent(event);

    const storedVolunteerFormData = JSON.parse(localStorage.getItem("volunteerData"));

    expect(storedVolunteerFormData).toEqual([{
        volunteerCharity: "My Charity",
        volunteerHours: 4,
        volunteerDate: "2024-11-01",
        volunteerRating: 5,
    }]);
});

test("volunteer data is correctly retrieved from localStorage and loaded into the table",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <body class="nested-body">
        <div class="volunteer-hours-tracker" id="volunteer-hours-tracker">
            <div id="volunteer-hours-form-wrapper">
                <form class="volunteer-hours-form" id="volunteer-hours-form">
                    <h1 class="volunteer-hours-header">Volunteer Hours Tracker</h1>
                    <div class="charity-name">
                        <div class="input-container">
                            <label for="charity-name">Charity Name:</label>
                            <input type="text" id="charity-name" name="charity-name" maxlength="50" value="My Charity" />
                        </div>
                        <span class="volunteer-form-error" id="charity-name_error">
                            * Please enter the name of the charity.
                        </span>
                    </div>

                    <div class="hours-volunteered">
                        <div class="input-container">
                            <label for="hours-volunteered">Hours Volunteered:</label>
                            <input type="number" id="hours-volunteered" name="hours-volunteered" maxlength="2" value="4" />					
                        </div>
                        <span class="volunteer-form-error" id="hours-volunteered_error">
                            * Please enter the hours spent volunteering.
                        </span>
                    </div>

                    <div class="volunteer-hours-date">
                        <div class="input-container">
                            <label for="volunteer-hours-date">Date:</label>
                            <input type="date" id="volunteer-hours-date" name="volunteer-hours-date" value="2024-11-01"/>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-hours-date_error">
                            * Please enter the date when the volunteering occurred.
                        </span>
                    </div>

                    <div class="volunteer-experience-rating">
                        <div class="input-container">
                            <label for="volunteer-experience-rating">Experience Rating:</label>
                            <ul id="volunteer-experience-rating" name="volunteer-experience-rating">
                                <li class="star starsSelected" value="1">&#9733;</li>
                                <li class="star starsSelected" value="2">&#9733;</li>
                                <li class="star starsSelected" value="3">&#9733;</li>
                                <li class="star starsSelected" value="4">&#9733;</li>
                                <li class="star starsSelected" value="5">&#9733;</li>
                            </ul>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-experience-rating_error">
                            * Please give a star rating of your experience.
                        </span>
                    </div>

                    <div class="volunteer-form-buttons">
                        <button type="submit" id="submit-volunteer-form">Submit</button>
                    </div>
                </form>
            </div>

            <div class="volunteer-table-container">
                <table id="volunteer-table">
                    <thead>
                        <tr>
                            <th>Charity</th>
                            <th>Hours</th>
                            <th>Date</th>
                            <th>Rating</th>
                            <th>Delete Row</th>
                        </tr>
                    </thead>
                    <tbody id="volunteer-table-body"></tbody>
                </table>

                <div id="volunteer-hours-calculator">
                    <p id="display-total-hours">You have no volunteer hours.</p>
                </div>
            </div>
            <!-- <script src="bundle.js"></script> -->
            <!-- Script file to automatically adjust the size of iframes if they change 
            Code used was written by Jacob Filipp and retrieved from https://jacobfilipp.com/iframe-height-autoresize-crossdomain/ -->
        </div>
    </body>
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", function(event) {
        validateVolunteerForm(event, localStorage);
    });
    form.dispatchEvent(event);

    const volunteerTable = innerVolunteerDoc.getElementById("volunteer-table");

    const tableRows = volunteerTable.getElementsByTagName("tr");

    expect(tableRows.length).toBe(2)
    expect(tableRows[1].children[0].textContent).toBe("My Charity");
    expect(tableRows[1].children[1].textContent).toBe("4");
    expect(tableRows[1].children[2].textContent).toBe("2024-11-01");
    expect(tableRows[1].children[3].textContent).toBe("5/5");
});

test("volunteer summary section correctly calculates and displays the total hours volunteered",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <body class="nested-body">
        <div class="volunteer-hours-tracker" id="volunteer-hours-tracker">
            <div id="volunteer-hours-form-wrapper">
                <form class="volunteer-hours-form" id="volunteer-hours-form">
                    <h1 class="volunteer-hours-header">Volunteer Hours Tracker</h1>
                    <div class="charity-name">
                        <div class="input-container">
                            <label for="charity-name">Charity Name:</label>
                            <input type="text" id="charity-name" name="charity-name" maxlength="50" value="My Charity" />
                        </div>
                        <span class="volunteer-form-error" id="charity-name_error">
                            * Please enter the name of the charity.
                        </span>
                    </div>

                    <div class="hours-volunteered">
                        <div class="input-container">
                            <label for="hours-volunteered">Hours Volunteered:</label>
                            <input type="number" id="hours-volunteered" name="hours-volunteered" maxlength="2" value="4" />					
                        </div>
                        <span class="volunteer-form-error" id="hours-volunteered_error">
                            * Please enter the hours spent volunteering.
                        </span>
                    </div>

                    <div class="volunteer-hours-date">
                        <div class="input-container">
                            <label for="volunteer-hours-date">Date:</label>
                            <input type="date" id="volunteer-hours-date" name="volunteer-hours-date" value="2024-11-01"/>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-hours-date_error">
                            * Please enter the date when the volunteering occurred.
                        </span>
                    </div>

                    <div class="volunteer-experience-rating">
                        <div class="input-container">
                            <label for="volunteer-experience-rating">Experience Rating:</label>
                            <ul id="volunteer-experience-rating" name="volunteer-experience-rating">
                                <li class="star starsSelected" value="1">&#9733;</li>
                                <li class="star starsSelected" value="2">&#9733;</li>
                                <li class="star starsSelected" value="3">&#9733;</li>
                                <li class="star starsSelected" value="4">&#9733;</li>
                                <li class="star starsSelected" value="5">&#9733;</li>
                            </ul>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-experience-rating_error">
                            * Please give a star rating of your experience.
                        </span>
                    </div>

                    <div class="volunteer-form-buttons">
                        <button type="submit" id="submit-volunteer-form">Submit</button>
                    </div>
                </form>
            </div>

            <div class="volunteer-table-container">
                <table id="volunteer-table">
                    <thead>
                        <tr>
                            <th>Charity</th>
                            <th>Hours</th>
                            <th>Date</th>
                            <th>Rating</th>
                            <th>Delete Row</th>
                        </tr>
                    </thead>
                    <tbody id="volunteer-table-body"></tbody>
                </table>

                <div id="volunteer-hours-calculator">
                    <p id="display-total-hours">You have no volunteer hours.</p>
                </div>
            </div>
            <!-- <script src="bundle.js"></script> -->
            <!-- Script file to automatically adjust the size of iframes if they change 
            Code used was written by Jacob Filipp and retrieved from https://jacobfilipp.com/iframe-height-autoresize-crossdomain/ -->
        </div>
    </body>
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", function(event) {
        validateVolunteerForm(event, localStorage);
    });
    form.dispatchEvent(event);

    const volunteerSumary = innerVolunteerDoc.getElementById("display-total-hours").innerHTML;

    expect(volunteerSumary).toBe("You have 4 volunteer hours.");
});

test("volunteer table delete button removes a record from the table",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <body class="nested-body">
        <div class="volunteer-hours-tracker" id="volunteer-hours-tracker">
            <div id="volunteer-hours-form-wrapper">
                <form class="volunteer-hours-form" id="volunteer-hours-form">
                    <h1 class="volunteer-hours-header">Volunteer Hours Tracker</h1>
                    <div class="charity-name">
                        <div class="input-container">
                            <label for="charity-name">Charity Name:</label>
                            <input type="text" id="charity-name" name="charity-name" maxlength="50" value="My Charity" />
                        </div>
                        <span class="volunteer-form-error" id="charity-name_error">
                            * Please enter the name of the charity.
                        </span>
                    </div>

                    <div class="hours-volunteered">
                        <div class="input-container">
                            <label for="hours-volunteered">Hours Volunteered:</label>
                            <input type="number" id="hours-volunteered" name="hours-volunteered" maxlength="2" value="4" />					
                        </div>
                        <span class="volunteer-form-error" id="hours-volunteered_error">
                            * Please enter the hours spent volunteering.
                        </span>
                    </div>

                    <div class="volunteer-hours-date">
                        <div class="input-container">
                            <label for="volunteer-hours-date">Date:</label>
                            <input type="date" id="volunteer-hours-date" name="volunteer-hours-date" value="2024-11-01"/>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-hours-date_error">
                            * Please enter the date when the volunteering occurred.
                        </span>
                    </div>

                    <div class="volunteer-experience-rating">
                        <div class="input-container">
                            <label for="volunteer-experience-rating">Experience Rating:</label>
                            <ul id="volunteer-experience-rating" name="volunteer-experience-rating">
                                <li class="star starsSelected" value="1">&#9733;</li>
                                <li class="star starsSelected" value="2">&#9733;</li>
                                <li class="star starsSelected" value="3">&#9733;</li>
                                <li class="star starsSelected" value="4">&#9733;</li>
                                <li class="star starsSelected" value="5">&#9733;</li>
                            </ul>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-experience-rating_error">
                            * Please give a star rating of your experience.
                        </span>
                    </div>

                    <div class="volunteer-form-buttons">
                        <button type="submit" id="submit-volunteer-form">Submit</button>
                    </div>
                </form>
            </div>

            <div class="volunteer-table-container">
                <table id="volunteer-table">
                    <thead>
                        <tr>
                            <th>Charity</th>
                            <th>Hours</th>
                            <th>Date</th>
                            <th>Rating</th>
                            <th>Delete Row</th>
                        </tr>
                    </thead>
                    <tbody id="volunteer-table-body"></tbody>
                </table>

                <div id="volunteer-hours-calculator">
                    <p id="display-total-hours">You have no volunteer hours.</p>
                </div>
            </div>
            <!-- <script src="bundle.js"></script> -->
            <!-- Script file to automatically adjust the size of iframes if they change 
            Code used was written by Jacob Filipp and retrieved from https://jacobfilipp.com/iframe-height-autoresize-crossdomain/ -->
        </div>
    </body>
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", function(event) {
        validateVolunteerForm(event, localStorage);
    });
    form.dispatchEvent(event);

    let deleteVolunteerButtons = innerVolunteerDoc.getElementsByClassName("delete-volunteer");

    deleteVolunteerButtons[0].click();

    const volunteerTable = innerVolunteerDoc.getElementById("volunteer-table");

    const tableRows = volunteerTable.getElementsByTagName("tr");

    expect(tableRows.length).toBe(1);
});

test("volunteer table delete button removes a record from localStorage",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <body class="nested-body">
        <div class="volunteer-hours-tracker" id="volunteer-hours-tracker">
            <div id="volunteer-hours-form-wrapper">
                <form class="volunteer-hours-form" id="volunteer-hours-form">
                    <h1 class="volunteer-hours-header">Volunteer Hours Tracker</h1>
                    <div class="charity-name">
                        <div class="input-container">
                            <label for="charity-name">Charity Name:</label>
                            <input type="text" id="charity-name" name="charity-name" maxlength="50" value="My Charity" />
                        </div>
                        <span class="volunteer-form-error" id="charity-name_error">
                            * Please enter the name of the charity.
                        </span>
                    </div>

                    <div class="hours-volunteered">
                        <div class="input-container">
                            <label for="hours-volunteered">Hours Volunteered:</label>
                            <input type="number" id="hours-volunteered" name="hours-volunteered" maxlength="2" value="4" />					
                        </div>
                        <span class="volunteer-form-error" id="hours-volunteered_error">
                            * Please enter the hours spent volunteering.
                        </span>
                    </div>

                    <div class="volunteer-hours-date">
                        <div class="input-container">
                            <label for="volunteer-hours-date">Date:</label>
                            <input type="date" id="volunteer-hours-date" name="volunteer-hours-date" value="2024-11-01"/>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-hours-date_error">
                            * Please enter the date when the volunteering occurred.
                        </span>
                    </div>

                    <div class="volunteer-experience-rating">
                        <div class="input-container">
                            <label for="volunteer-experience-rating">Experience Rating:</label>
                            <ul id="volunteer-experience-rating" name="volunteer-experience-rating">
                                <li class="star starsSelected" value="1">&#9733;</li>
                                <li class="star starsSelected" value="2">&#9733;</li>
                                <li class="star starsSelected" value="3">&#9733;</li>
                                <li class="star starsSelected" value="4">&#9733;</li>
                                <li class="star starsSelected" value="5">&#9733;</li>
                            </ul>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-experience-rating_error">
                            * Please give a star rating of your experience.
                        </span>
                    </div>

                    <div class="volunteer-form-buttons">
                        <button type="submit" id="submit-volunteer-form">Submit</button>
                    </div>
                </form>
            </div>

            <div class="volunteer-table-container">
                <table id="volunteer-table">
                    <thead>
                        <tr>
                            <th>Charity</th>
                            <th>Hours</th>
                            <th>Date</th>
                            <th>Rating</th>
                            <th>Delete Row</th>
                        </tr>
                    </thead>
                    <tbody id="volunteer-table-body"></tbody>
                </table>

                <div id="volunteer-hours-calculator">
                    <p id="display-total-hours">You have no volunteer hours.</p>
                </div>
            </div>
            <!-- <script src="bundle.js"></script> -->
            <!-- Script file to automatically adjust the size of iframes if they change 
            Code used was written by Jacob Filipp and retrieved from https://jacobfilipp.com/iframe-height-autoresize-crossdomain/ -->
        </div>
    </body>
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", function(event) {
        validateVolunteerForm(event, localStorage);
    });
    form.dispatchEvent(event);

    let deleteVolunteerButtons = innerVolunteerDoc.getElementsByClassName("delete-volunteer");

    deleteVolunteerButtons[0].click();

    const storedVolunteerFormData = JSON.parse(localStorage.getItem("volunteerData"));

    expect(storedVolunteerFormData).toEqual([]);
});

test("volunteer total volunteered hours in the summary section is updated when a log is deleted",() => {

    const dom = new JSDOM (`
        <!Doctype html>
        <body>
            <iframe id="volunteer-hours-tracker"></iframe>
        </body>
        `)
    
    const volunteerFrame = dom.window.document.getElementById("volunteer-hours-tracker");

    const innerVolunteerDoc =
    volunteerFrame.contentDocument || volunteerFrame.contentWindow.document;

    global.document = dom.window.document;

    innerVolunteerDoc.body.innerHTML = `
        <body class="nested-body">
        <div class="volunteer-hours-tracker" id="volunteer-hours-tracker">
            <div id="volunteer-hours-form-wrapper">
                <form class="volunteer-hours-form" id="volunteer-hours-form">
                    <h1 class="volunteer-hours-header">Volunteer Hours Tracker</h1>
                    <div class="charity-name">
                        <div class="input-container">
                            <label for="charity-name">Charity Name:</label>
                            <input type="text" id="charity-name" name="charity-name" maxlength="50" value="My Charity" />
                        </div>
                        <span class="volunteer-form-error" id="charity-name_error">
                            * Please enter the name of the charity.
                        </span>
                    </div>

                    <div class="hours-volunteered">
                        <div class="input-container">
                            <label for="hours-volunteered">Hours Volunteered:</label>
                            <input type="number" id="hours-volunteered" name="hours-volunteered" maxlength="2" value="4" />					
                        </div>
                        <span class="volunteer-form-error" id="hours-volunteered_error">
                            * Please enter the hours spent volunteering.
                        </span>
                    </div>

                    <div class="volunteer-hours-date">
                        <div class="input-container">
                            <label for="volunteer-hours-date">Date:</label>
                            <input type="date" id="volunteer-hours-date" name="volunteer-hours-date" value="2024-11-01"/>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-hours-date_error">
                            * Please enter the date when the volunteering occurred.
                        </span>
                    </div>

                    <div class="volunteer-experience-rating">
                        <div class="input-container">
                            <label for="volunteer-experience-rating">Experience Rating:</label>
                            <ul id="volunteer-experience-rating" name="volunteer-experience-rating">
                                <li class="star starsSelected" value="1">&#9733;</li>
                                <li class="star starsSelected" value="2">&#9733;</li>
                                <li class="star starsSelected" value="3">&#9733;</li>
                                <li class="star starsSelected" value="4">&#9733;</li>
                                <li class="star starsSelected" value="5">&#9733;</li>
                            </ul>
                        </div>
                        <span class="volunteer-form-error" id="volunteer-experience-rating_error">
                            * Please give a star rating of your experience.
                        </span>
                    </div>

                    <div class="volunteer-form-buttons">
                        <button type="submit" id="submit-volunteer-form">Submit</button>
                    </div>
                </form>
            </div>

            <div class="volunteer-table-container">
                <table id="volunteer-table">
                    <thead>
                        <tr>
                            <th>Charity</th>
                            <th>Hours</th>
                            <th>Date</th>
                            <th>Rating</th>
                            <th>Delete Row</th>
                        </tr>
                    </thead>
                    <tbody id="volunteer-table-body"></tbody>
                </table>

                <div id="volunteer-hours-calculator">
                    <p id="display-total-hours">You have no volunteer hours.</p>
                </div>
            </div>
            <!-- <script src="bundle.js"></script> -->
            <!-- Script file to automatically adjust the size of iframes if they change 
            Code used was written by Jacob Filipp and retrieved from https://jacobfilipp.com/iframe-height-autoresize-crossdomain/ -->
        </div>
    </body>
    `;

    const form = innerVolunteerDoc.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", function(event) {
        validateVolunteerForm(event, localStorage);
    });
    form.dispatchEvent(event);

    let deleteVolunteerButtons = innerVolunteerDoc.getElementsByClassName("delete-volunteer");

    deleteVolunteerButtons[0].click();

    const volunteerSumary = innerVolunteerDoc.getElementById("display-total-hours").innerHTML;

    expect(volunteerSumary).toBe("You have 0 volunteer hours.");
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