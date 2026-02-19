// state.js - in-memory store, all mutations persist to localStorage
var records  = loadRecords();
var settings = loadSettings();

function generateId() {
    var highest = 0;
    for (var i = 0; i < records.length; i++) {
        var num = parseInt(records[i].id.replace("rec_",""));
        if (num > highest) highest = num;
    }
    var next = String(highest + 1);
    while (next.length < 4) next = "0" + next;
    return "rec_" + next;
}

function getRecords()  { return records.slice(); }
function getSettings() { return settings; }
function addRecord(data) {
    var now = new Date().toISOString();
    var rec = { id: generateId(), description: data.description, amount: parseFloat(data.amount), category: data.category, date: data.date, createdAt: now, updatedAt: now };
    records.push(rec);
    saveRecords(records);
    return rec;
}

function updateRecord(id, data) {
    for (var i = 0; i < records.length; i++) {
        if (records[i].id == id) {
            records[i].description = data.description;
            records[i].amount = parseFloat(data.amount);
            records[i].category = data.category;
            records[i].date = data.date;
            records[i].updatedAt = new Date().toISOString();
            saveRecords(records);
            return records[i];
        }
    }
}
function deleteRecord(id) {
    var newList = [];
    for (var i = 0; i < records.length; i++) {
        if (records[i].id != id) newList.push(records[i]);
    }
    records = newList;
    saveRecords(records);
}

function replaceRecords(newRecords) { records = newRecords; saveRecords(records); }
function updateSettings(newSettings) { settings = newSettings; saveSettings(settings); }
function getStats() {
    var total = 0;
    for (var i = 0; i < records.length; i++) { total += records[i].amount; }

    var catTotals = {};
    for (var j = 0; j < records.length; j++) {
        var c = records[j].category;
        if (!catTotals[c]) catTotals[c] = 0;
        catTotals[c] += records[j].amount;
    }
    var topCat = "—", topAmt = 0;
    for (var cat in catTotals) { if (catTotals[cat] > topAmt) { topAmt = catTotals[cat]; topCat = cat; } }

    var budget = parseFloat(settings.budget) || 0;
    var remaining = budget > 0 ? budget - total : null;
    var today = new Date();
    var trend = [];
    for (var d = 6; d >= 0; d--) {
        var day = new Date(today); day.setDate(today.getDate() - d);
        var dateStr = day.toISOString().slice(0,10);
        var label = day.toLocaleDateString("en",{weekday:"short"});
        var dayTotal = 0;
        for (var k = 0; k < records.length; k++) { if (records[k].date == dateStr) dayTotal += records[k].amount; }
        trend.push({label:label, total:dayTotal});
    }
    return { total:total, count:records.length, topCat:topCat, budget:budget, remaining:remaining, trend:trend };
}

