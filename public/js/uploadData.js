const back = document.querySelector(".backButton");

back.addEventListener("click", function() {
    // Go back in the browser history
    window.history.back();
});