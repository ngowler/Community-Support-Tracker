(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function load() {
    selectStar();
    document.getElementById("volunteer-hours-form").addEventListener("submit", validateVolunteerForm);
}

function validateVolunteerForm(e) {
    volunteerHideErrors();
    if(volunteerFormHasErrors()) {
        e.preventDefault();
    } else {
        let volunteerData = {};
        volunteerData.charityName = document.getElementById("charity-name").value;
        volunteerData.hoursVolunteered = parseFloat(document.getElementById("hours-volunteered").value);
        volunteerData.date = document.getElementById("volunteer-hours-date").value;
        volunteerData.stars = document.getElementsByClassName("starsSelected").length;
    }
}

function volunteerHideErrors() {
    let errorFields = document.getElementsByClassName("volunteer-form-error");
    for(let i=0; i<errorFields.length; i++) {
        errorFields[i].style.display = "none";
    }
}

function volunteerShowError(formField, errorId, errorFlag) {
	document.getElementById(errorId).style.display = "block";
	if(!errorFlag) {
		document.getElementById(formField).focus();
		if(formField.type == "text") {
			document.getElementById(formField).select();
		}
	}
}

function volunteerFormHasErrors() {
    let errorFlag = false;
    let charityName = document.getElementById("charity-name").value;
    if(charityName == "" || charityName == null) {
        volunteerShowError("charity-name", "charity-name_error", errorFlag);
        errorFlag=true;
    }
    let hoursVolunteered = document.getElementById("hours-volunteered").value;
    if(hoursVolunteered < 0 || hoursVolunteered == "" || hoursVolunteered == null) {
        volunteerShowError("hours-volunteered", "hours-volunteered_error", errorFlag);
        errorFlag=true;
    }
    let volunteerDate = document.getElementById("volunteer-hours-date").value;
    if(volunteerDate == "" || volunteerDate == null) {
        volunteerShowError("volunteer-hours-date", "volunteer-hours-date_error", errorFlag);
        errorFlag=true;
    }
    let numberOfStars = document.getElementsByClassName("starsSelected").length;
    if(numberOfStars == 0){
        volunteerShowError("volunteer-experience-rating", "volunteer-experience-rating_error", errorFlag);
        errorFlag=true;
    }
    return errorFlag;
}

function selectStar() {
    const stars = Array.from(document.getElementsByClassName("star"));
    stars.forEach((star) => {
        star.addEventListener("click", () => {
            resetStars();
            for(i=0; i<star.value; i++) {
                stars[i].classList.add("starsSelected");
            }
        });
    });
}

function resetStars() {
    const stars = Array.from(document.getElementsByClassName("star"));
    stars.forEach((star) => {
        star.classList.remove("starsSelected");
    });
}

if (typeof window !== "undefined") {
    window.onload = load;
} else {
    module.exports = {validateVolunteerForm, volunteerHideErrors, volunteerShowError, volunteerFormHasErrors, selectStar, resetStars, load};
}
},{}]},{},[1]);
