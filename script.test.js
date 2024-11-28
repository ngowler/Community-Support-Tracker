const {JSDOM} = require("jsdom");

const {validateVolunteerForm, volunteerHideErrors, volunteerShowError, volunteerFormHasErrors, selectStar, resetStars, load} = require("./script");

const mockValidateVolunteerForm = jest.fn(validateVolunteerForm);

test("validateVolunteerForm is triggered on form submission",() => {

    const dom = new JSDOM (`
        <!Doctype html>
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
    `);

    global.document = dom.window.document;
    const form = document.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    expect(mockValidateVolunteerForm).toHaveBeenCalled();
});

test("validateVolunteerForm correctly collects form data",() => {

    const dom = new JSDOM (`
        <!Doctype html>
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
    `);
    
    global.document = dom.window.document;
    const form = document.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    volunteerData = {
        charityName: "My Charity",
        hoursVolunteered: 4,
        date: "2024-11-01",
        stars: 5
    }

    expect(document.getElementById("charity-name").value).toBe(volunteerData.charityName);
    expect(parseFloat(document.getElementById("hours-volunteered").value)).toBe(volunteerData.hoursVolunteered);
    expect(document.getElementById("volunteer-hours-date").value).toBe(volunteerData.date);
    expect(document.getElementsByClassName("starSelected").length).toBe(volunteerData.stars);
});

test("validateVolunteerForm correctly flags empty inputs",() => {
    const dom = new JSDOM (`
        <!Doctype html>
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
    `);

    global.document = dom.window.document;
    const form = document.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    expect(volunteerFormHasErrors()).toBe(true);
});

test("validateVolunteerForm validates incorect number input",() => {
    const dom = new JSDOM (`
        <!Doctype html>
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
    `);

    global.document = dom.window.document;
    const form = document.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    document.getElementById("charity-name").value = "My Charity";
    document.getElementById("hours-volunteered").value = "-4";
    document.getElementById("volunteer-hours-date").value = "2024-11-01";
    document.querySelectorAll(".star").forEach(star => star.classList.add("starsSelected"));
    expect(volunteerFormHasErrors()).toBe(true);
});

test("validateVolunteerForm validates incorect star input",() => {
    const dom = new JSDOM (`
        <!Doctype html>
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
    `);
    global.document = dom.window.document;
    const form = document.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);

    document.getElementById("charity-name").value = "My Charity";
    document.getElementById("hours-volunteered").value = "4";
    document.getElementById("volunteer-hours-date").value = "2024-11-01";
    document.querySelectorAll(".star").forEach(star => star.classList.remove("starsSelected"));

    expect(volunteerFormHasErrors()).toBe(true);
});

test("validateVolunteerForm correctly populates temporary data object",() => {

    const dom = new JSDOM (`
        <!Doctype html>
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
    `);

    global.document = dom.window.document;
    const form = document.getElementById("volunteer-hours-form");
    const event = new dom.window.Event("submit");
    form.addEventListener("submit", mockValidateVolunteerForm);
    form.dispatchEvent(event);
    
    volunteerData = {
        charityName: document.getElementById("charity-name").value,
        hoursVolunteered: parseFloat(document.getElementById("hours-volunteered").value),
        date: document.getElementById("volunteer-hours-date").value,
        stars: document.getElementsByClassName("starSelected").length
    }

    expect(volunteerData.charityName).toBe("My Charity")
    expect(volunteerData.hoursVolunteered).toBe(4)
    expect(volunteerData.date).toBe("2024-11-01")
    expect(volunteerData.stars).toBe(5)
});