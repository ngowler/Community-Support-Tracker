
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
    console.log(volunteerFrame);

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
    
    volunteerData = {
        charityName: innerVolunteerDoc.getElementById("charity-name").value,
        hoursVolunteered: parseFloat(innerVolunteerDoc.getElementById("hours-volunteered").value),
        date: innerVolunteerDoc.getElementById("volunteer-hours-date").value,
        stars: innerVolunteerDoc.getElementsByClassName("starSelected").length
    }

    expect(volunteerData.charityName).toBe("My Charity")
    expect(volunteerData.hoursVolunteered).toBe(4)
    expect(volunteerData.date).toBe("2024-11-01")
    expect(volunteerData.stars).toBe(5)
});