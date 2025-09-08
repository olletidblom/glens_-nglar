document.addEventListener("DOMContentLoaded", function () {
    const pollForm = 
        document.getElementById("poll-form");
    const axelCount = 
        document.getElementById("axel-count");
    const baptCount = 
        document.getElementById("bapt-count");
    const eliasCount = 
        document.getElementById("elias-count");
    const joakimCount = 
        document.getElementById("joakim-count");
    const olleCount = 
        document.getElementById("olle-count");
    let axelVotes = 0;
    let baptVotes = 0;
    let eliasVotes = 0;
    let joakimVotes = 0;
    let olleVotes = 0;

    pollForm.addEventListener("submit", function (e) {

        // It will help to prevent the submission of 
        // form, so that following code can execute
        e.preventDefault();
        const formData = new FormData(pollForm);
        const userVote = formData.get("vote");


        if (userVote === "Axel") {
            axelVotes++;
        } else if (userVote === "Bapt") {
            baptVotes++;
        }
        else if (userVote === "Elias") {
            eliasVotes++;
        }
        else if (userVote === "Joakim") {
            joakimVotes++;
        }
        else if (userVote === "Olle") {
            olleVotes++;
        }
        updateResults();
    });

    function updateResults() {
        
        axelCount.textContent = axelVotes;
        baptCount.textContent = baptVotes;
        eliasCount.textContent = eliasVotes;
        joakimCount.textContent = joakimVotes;
        olleCount.textContent = olleVotes;
    }
});