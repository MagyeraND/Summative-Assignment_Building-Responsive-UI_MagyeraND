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
