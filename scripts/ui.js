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
function renderDashboard() {
    var stats = getStats(), sym = getCurrencySymbol();
    document.getElementById("stat-total-records").textContent = stats.count;
    document.getElementById("stat-total-spent").textContent   = sym + stats.total.toFixed(2);
    document.getElementById("stat-top-category").textContent  = stats.topCat;
    var fill  = document.getElementById("budget-bar-fill");
    var label = document.getElementById("budget-bar-label");
    var track = document.querySelector(".budget-bar-track");
    if (stats.budget > 0) {
        var pct = (stats.total / stats.budget) * 100; if (pct > 100) pct = 100;
        fill.style.width = pct + "%"; track.setAttribute("aria-valuenow", Math.round(pct));
        if (stats.total > stats.budget) {
            var over = stats.total - stats.budget;
            fill.classList.add("over");
            label.textContent = "Over budget by " + sym + over.toFixed(2) + "!";
            document.getElementById("stat-budget-left").textContent = "-" + sym + over.toFixed(2);
            announceAssertive("Warning: over budget by " + sym + over.toFixed(2));
        } else {
            fill.classList.remove("over");
            label.textContent = sym + stats.remaining.toFixed(2) + " remaining";
            document.getElementById("stat-budget-left").textContent = sym + stats.remaining.toFixed(2);
        }
    } else {
        fill.style.width = "0%"; label.textContent = "Set a budget cap in Settings";
        document.getElementById("stat-budget-left").textContent = "—";
    }
    var chart = document.getElementById("trend-chart"), maxVal = 1;
    for (var i = 0; i < stats.trend.length; i++) { if (stats.trend[i].total > maxVal) maxVal = stats.trend[i].total; }
    var html = "";
    for (var j = 0; j < stats.trend.length; j++) {
        var d = stats.trend[j], h = (d.total / maxVal) * 100;
        html += '<div class="trend-bar-wrap" title="' + d.label + ': ' + sym + d.total.toFixed(2) + '">';
        html += '<div class="trend-bar" style="height:' + h + '%"></div>';
        html += '<span class="trend-day">' + d.label + "</span></div>";
    }
    chart.innerHTML = html;
}
