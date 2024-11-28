function load() {
    selectStar();
    document.getElementById("volunteer-hours-form").addEventListener("submit", validateVolunteerForm);
}

function validateVolunteerForm(e) {
    hideErrors();
    if(formHasErrors()) {
        e.preventDefault();
    } else {
        let volunteerData = {};
        volunteerData.charityName = document.getElementById("charity-name").value;
        volunteerData.hoursVolunteered = parseFloat(document.getElementById("hours-volunteered").value);
        volunteerData.date = document.getElementById("volunteer-hours-date").value;
        volunteerData.stars = document.getElementsByClassName("starsSelected").length;
    }
}

function hideErrors() {
    let errorFields = document.getElementsByClassName("volunteer-form-error");
    for(let i=0; i<errorFields.length; i++) {
        errorFields[i].style.display = "none";
    }
}

function showError(formField, errorId, errorFlag) {
	document.getElementById(errorId).style.display = "block";
	if(!errorFlag) {
		document.getElementById(formField).focus();
		if(formField.type == "text") {
			document.getElementById(formField).select();
		}
	}
}

function formHasErrors() {
    let errorFlag = false;
    let charityName = document.getElementById("charity-name").value;
    if(charityName == "" || charityName == null) {
        showError("charity-name", "charity-name_error", errorFlag);
        errorFlag=true;
    }
    let hoursVolunteered = document.getElementById("hours-volunteered").value;
    if(hoursVolunteered < 0 || hoursVolunteered == "" || hoursVolunteered == null) {
        showError("hours-volunteered", "hours-volunteered_error", errorFlag);
        errorFlag=true;
    }
    let volunteerDate = document.getElementById("volunteer-hours-date").value;
    if(volunteerDate == "" || volunteerDate == null) {
        showError("volunteer-hours-date", "volunteer-hours-date_error", errorFlag);
        errorFlag=true;
    }
    let numberOfStars = document.getElementsByClassName("starsSelected").length;
    if(numberOfStars == 0){
        showError("volunteer-experience-rating", "volunteer-experience-rating_error", errorFlag);
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
    module.exports = {validateVolunteerForm, hideErrors, showError, formHasErrors, selectStar, resetStars, load};
}