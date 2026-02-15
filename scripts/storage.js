var RECORDS_KEY  = "campuscash_records";
var SETTINGS_KEY = "campuscash_settings";

function loadRecords() {
    var saved = localStorage.getItem(RECORDS_KEY);
    if (saved) { return JSON.parse(saved); }
    return [];
}

function saveRecords(records) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}
