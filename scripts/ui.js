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
function renderRecords() {
    var data = getRecords();
    if (currentCatFilter) {
        var tmp = []; for (var i=0;i<data.length;i++){if(data[i].category==currentCatFilter)tmp.push(data[i]);} data = tmp;
    }
    if (searchRegex) {
        var tmp2 = []; for (var j=0;j<data.length;j++){if(searchRegex.test(data[j].description)||searchRegex.test(data[j].category))tmp2.push(data[j]);} data = tmp2;
    }
    data = sortRecords(data);
    var tbody = document.getElementById("records-tbody");
    var empty = document.getElementById("records-empty");
    if (data.length == 0) { tbody.innerHTML = ""; empty.hidden = false; return; }
    empty.hidden = true;
    var sym = getCurrencySymbol(), html = "";
    for (var k = 0; k < data.length; k++) {
        var r = data[k];
        html += "<tr><td data-label='Description'>" + highlightText(r.description, searchRegex) + "</td>";
        html += "<td data-label='Amount'>" + sym + r.amount.toFixed(2) + "</td>";
        html += "<td data-label='Category'><span class='badge'>" + highlightText(r.category, searchRegex) + "</span></td>";
        html += "<td data-label='Date'>" + r.date + "</td>";
        html += "<td data-label='Actions'><button class='btn-edit' data-id='" + r.id + "'>Edit</button> ";
        html += "<button class='btn-delete' data-id='" + r.id + "'>Delete</button></td></tr>";
    }
    tbody.innerHTML = html;
    refreshCategoryFilter();
}
document.getElementById("records-tbody").addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-edit")) {
        var id = e.target.getAttribute("data-id"), recs = getRecords();
        for (var i=0;i<recs.length;i++){ if(recs[i].id==id){ openEditForm(recs[i]); break; } }
    }
    if (e.target.classList.contains("btn-delete")) {
        var id2 = e.target.getAttribute("data-id"), recs2 = getRecords(), name="this record";
        for (var j=0;j<recs2.length;j++){ if(recs2[j].id==id2){ name=recs2[j].description; break; } }
        if (confirm('Delete "' + name + '"?')) { deleteRecord(id2); announcePolite(name + " deleted."); renderRecords(); renderDashboard(); }
    }
});
document.getElementById("btn-export").addEventListener("click", function() {
    var data = { app:"Campus Cash Calc", version:1, exportedAt:new Date().toISOString(), records:getRecords() };
    var blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href=url; a.download="campuscashcalc-export.json"; a.click(); URL.revokeObjectURL(url);
    announcePolite("Exported successfully!");
});
document.getElementById("btn-import").addEventListener("change", function(e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
        var parsed; try { parsed = JSON.parse(ev.target.result); } catch(err) { alert("Couldn't read file."); return; }
        if (!parsed || !Array.isArray(parsed.records)) { alert("Import failed."); return; }
        replaceRecords(parsed.records); renderRecords(); renderDashboard();
        announcePolite("Imported " + parsed.records.length + " records.");
    };
    reader.readAsText(file); e.target.value = "";
});
var form = document.getElementById("transaction-form");
var formStatus = document.getElementById("form-status");
function showFormMsg(msg, type) { formStatus.textContent = msg; formStatus.className = "form-status " + (type||"success"); announcePolite(msg); }
function resetForm() {
    form.reset(); document.getElementById("field-edit-id").value = "";
    document.getElementById("heading-add").innerHTML = "Add <span>Transaction</span>";
    document.getElementById("btn-submit").textContent = "Save Transaction";
    formStatus.textContent = ""; formStatus.className = "form-status";
    showFieldError("field-description","err-description",""); showFieldError("field-amount","err-amount","");
    showFieldError("field-category","err-category",""); showFieldError("field-date","err-date","");
}
function openEditForm(rec) {
    showSection("#section-add");
    document.getElementById("heading-add").innerHTML = "Edit <span>Transaction</span>";
    document.getElementById("btn-submit").textContent = "Update Transaction";
    document.getElementById("field-description").value = rec.description;
    document.getElementById("field-amount").value = rec.amount;
    document.getElementById("field-category").value = rec.category;
    document.getElementById("field-date").value = rec.date;
    document.getElementById("field-edit-id").value = rec.id;
}
var descEl = document.getElementById("field-description");
descEl.addEventListener("blur", function(){ var r=validateDescription(descEl.value); showFieldError("field-description","err-description",r.ok?"":r.msg); });
descEl.addEventListener("input",function(){ if(descEl.classList.contains("invalid")&&validateDescription(descEl.value).ok) showFieldError("field-description","err-description",""); });
var amtEl  = document.getElementById("field-amount");
amtEl.addEventListener("blur",  function(){ var r=validateAmount(amtEl.value);  showFieldError("field-amount","err-amount",r.ok?"":r.msg); });
var dateEl = document.getElementById("field-date");
dateEl.addEventListener("blur", function(){ var r=validateDate(dateEl.value);   showFieldError("field-date","err-date",r.ok?"":r.msg); });
form.addEventListener("submit", function(e) {
    e.preventDefault();
    var desc=document.getElementById("field-description").value, amt=document.getElementById("field-amount").value;
    var cat =document.getElementById("field-category").value,  date=document.getElementById("field-date").value;
    var result = validateRecord({description:desc,amount:amt,category:cat,date:date});
    showFieldError("field-description","err-description",result.errors.description||"");
    showFieldError("field-amount","err-amount",result.errors.amount||"");
    showFieldError("field-category","err-category",result.errors.category||"");
    showFieldError("field-date","err-date",result.errors.date||"");
    if (!result.ok) { showFormMsg("Please fix the errors above.","error"); return; }
    var editId = document.getElementById("field-edit-id").value;
    if (editId) { updateRecord(editId,{description:desc,amount:amt,category:cat,date:date}); showFormMsg("Record updated!"); }
    else { addRecord({description:desc,amount:amt,category:cat,date:date}); showFormMsg("Transaction saved!"); }
    resetForm(); renderDashboard();
});
document.getElementById("btn-cancel").addEventListener("click",function(){ resetForm(); showSection("#section-records"); });
