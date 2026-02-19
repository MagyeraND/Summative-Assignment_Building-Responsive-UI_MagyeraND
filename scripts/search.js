// search.js - regex search, sort, filter and highlight rendering
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
function sortRecords(data) {
    var copy = data.slice();
    copy.sort(function(a,b){
        if (currentSort=="date-desc")  return b.date.localeCompare(a.date);
        if (currentSort=="date-asc")   return a.date.localeCompare(b.date);
        if (currentSort=="desc-az")    return a.description.localeCompare(b.description);
        if (currentSort=="desc-za")    return b.description.localeCompare(a.description);
        if (currentSort=="amount-asc") return a.amount - b.amount;
        if (currentSort=="amount-desc")return b.amount - a.amount;
        return 0;
    });
    return copy;
}

function refreshCategoryFilter() {
    var sel = document.getElementById("category-filter");
    var prev = sel.value;
    var all = getRecords(), cats = [];
    for (var i = 0; i < all.length; i++) { if (cats.indexOf(all[i].category)==-1) cats.push(all[i].category); }
    cats.sort();
    var html = '<option value="">All</option>';
    for (var j = 0; j < cats.length; j++) { html += "<option"+(cats[j]==prev?" selected":"")+">" + cats[j] + "</option>"; }
    sel.innerHTML = html;
}
function handleSearch() {
    var input = document.getElementById("search-input");
    var pattern = input.value.trim();
    if (!pattern) { searchRegex = null; input.classList.remove("invalid"); renderRecords(); return; }
    var compiled = compileSearchRegex(pattern, false);
    if (compiled) { searchRegex = compiled; input.classList.remove("invalid"); }
    else { searchRegex = null; input.classList.add("invalid"); document.getElementById("status-msg").textContent = "Invalid search pattern."; }
    renderRecords();
}

document.getElementById("search-input").addEventListener("input", handleSearch);
document.getElementById("sort-select").addEventListener("change", function(){ currentSort = this.value; renderRecords(); });
document.getElementById("category-filter").addEventListener("change", function(){ currentCatFilter = this.value; renderRecords(); });

