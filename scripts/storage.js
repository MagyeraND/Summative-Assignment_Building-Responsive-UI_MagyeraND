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
function loadSettings() {
    var saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) {
        return {
            budget: "",
            baseCurrency: "RWF",
            rates: { USD: 0.00072 },
            categories: ["Food","Books","Transport","Entertainment","Fees","Other"]
        };
    }
    return JSON.parse(saved);
}

function saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function clearAllData() {
    localStorage.removeItem(RECORDS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
}
