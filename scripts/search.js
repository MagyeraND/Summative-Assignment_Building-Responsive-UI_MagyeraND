var currentSort = "date-desc";
var currentCatFilter = "";
var searchRegex = null;

function escapeHTML(str) {
    return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function highlightText(text, regex) {
    if (!regex) return escapeHTML(text);
    try { return escapeHTML(text).replace(regex, function(m){ return "<mark>" + m + "</mark>"; }); }
    catch(e) { return escapeHTML(text); }
}
