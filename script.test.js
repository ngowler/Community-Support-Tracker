
const {JSDOM} = require("jsdom");

const {validateVolunteerForm, volunteerHideErrors, volunteerShowError, volunteerFormHasErrors, selectStar, resetStars, load, donationValidateForm, donationHideErrors, donationFormHasInput, handleSubmit, validateForm} = require("./script");

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
        mockValidateVolunteerForm(event, global.localStorage);
    });
    form.dispatchEvent(event);

    volunteerData = {
        charityName: "My Charity",
        hoursVolunteered: 4,
        date: "2024-11-01",
        stars: 5
    }

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
        mockValidateVolunteerForm(event, global.localStorage);
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
        mockValidateVolunteerForm(event, global.localStorage);
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
        mockValidateVolunteerForm(event, global.localStorage);
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
        mockValidateVolunteerForm(event, global.localStorage);
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
        mockValidateVolunteerForm(event, global.localStorage);
    });
    form.dispatchEvent(event);

    let deleteVolunteerButtons = innerVolunteerDoc.getElementsByClassName("delete-volunteer");

    deleteVolunteerButtons[0].click();

    const volunteerSumary = innerVolunteerDoc.getElementById("display-total-hours").innerHTML;

    expect(volunteerSumary).toBe("You have 0 volunteer hours.");
});