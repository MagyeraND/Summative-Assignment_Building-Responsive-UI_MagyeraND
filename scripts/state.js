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
