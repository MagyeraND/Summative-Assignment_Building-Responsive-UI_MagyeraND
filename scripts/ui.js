var CURRENCY_SYMBOLS = { USD: "$", RWF: "RWF " };
function getCurrencySymbol() { var code = getSettings().baseCurrency; return CURRENCY_SYMBOLS[code] || code + " "; }
function announcePolite(msg) { var el = document.getElementById("status-msg"); el.textContent = ""; setTimeout(function(){ el.textContent = msg; }, 50); }
function announceAssertive(msg) { var el = document.getElementById("alert-msg"); el.textContent = ""; setTimeout(function(){ el.textContent = msg; }, 50); }
function showFieldError(fieldId, errId, msg) {
    var field = document.getElementById(fieldId); var errEl = document.getElementById(errId);
    if (!field || !errEl) return;
    errEl.textContent = msg;
    if (msg) { field.classList.add("invalid"); field.setAttribute("aria-invalid","true"); }
    else { field.classList.remove("invalid"); field.removeAttribute("aria-invalid"); }
}
var navLinks    = document.querySelectorAll(".nav-link");
var allSections = document.querySelectorAll(".app-section");
var navToggle   = document.querySelector(".nav-toggle");
var navMenu     = document.getElementById("primary-nav");

function showSection(id) {
    for (var i = 0; i < allSections.length; i++) { allSections[i].classList.remove("active"); }
    for (var j = 0; j < navLinks.length; j++)    { navLinks[j].classList.remove("active"); }
    var target = document.querySelector(id);
    var link   = document.querySelector('.nav-link[href="' + id + '"]');
    if (target) target.classList.add("active");
    if (link)   link.classList.add("active");
    if (id == "#section-dashboard") renderDashboard();
    if (id == "#section-records")   renderRecords();
    if (id == "#section-settings")  populateSettings();
    window.scrollTo({ top: 0, behavior: "instant" });
}
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function(e) {
        e.preventDefault(); showSection(this.getAttribute("href"));
        navMenu.classList.remove("open"); navToggle.setAttribute("aria-expanded","false");
    });
}
navToggle.addEventListener("click", function(){
    var open = navMenu.classList.toggle("open"); navToggle.setAttribute("aria-expanded", String(open));
});
