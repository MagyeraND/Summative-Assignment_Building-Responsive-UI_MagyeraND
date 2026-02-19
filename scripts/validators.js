// validators.js - regex validators for all form fields
var PATTERNS = {
    description: /^\S(?:.*\S)?$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    dupWord: /\b(\w+)\s+\1\b/i
};

function validateDescription(val) {
    if (!val || val.trim() == "") return { ok:false, msg:"Description is required." };
    if (!PATTERNS.description.test(val)) return { ok:false, msg:"Description can't start or end with spaces." };
    var dup = val.match(PATTERNS.dupWord);
    if (dup) return { ok:false, msg:You typed the same word twice: "" };
    return { ok:true, msg:"" };
}
function validateAmount(val) {
    if (!val || String(val).trim() == "") return { ok:false, msg:"Amount is required." };
    if (!PATTERNS.amount.test(String(val).trim())) return { ok:false, msg:"Enter a valid amount e.g. 2500 or 12.50" };
    return { ok:true, msg:"" };
}

function validateDate(val) {
    if (!val) return { ok:false, msg:"Date is required." };
    if (!PATTERNS.date.test(val)) return { ok:false, msg:"Use YYYY-MM-DD format e.g. 2026-02-15" };
    return { ok:true, msg:"" };
}
function validateCategory(val) {
    if (!val || val.trim() == "") return { ok:false, msg:"Please pick a category." };
    if (!PATTERNS.category.test(val.trim())) return { ok:false, msg:"Category should only have letters, spaces or hyphens." };
    return { ok:true, msg:"" };
}

function validateBudget(val) {
    if (val == "" || val == null) return { ok:true, msg:"" };
    if (!PATTERNS.amount.test(String(val).trim())) return { ok:false, msg:"Budget must be a positive number." };
    return { ok:true, msg:"" };
}

function validateRecord(fields) {
    var errors = {};
    var r1 = validateDescription(fields.description); if (!r1.ok) errors.description = r1.msg;
    var r2 = validateAmount(fields.amount);           if (!r2.ok) errors.amount = r2.msg;
    var r3 = validateCategory(fields.category);       if (!r3.ok) errors.category = r3.msg;
    var r4 = validateDate(fields.date);               if (!r4.ok) errors.date = r4.msg;
    return { ok: Object.keys(errors).length == 0, errors: errors };
}

function compileSearchRegex(pattern, caseSensitive) {
    if (!pattern) return null;
    try { return new RegExp(pattern, caseSensitive ? "" : "i"); }
    catch (e) { return null; }
}

