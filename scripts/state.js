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
