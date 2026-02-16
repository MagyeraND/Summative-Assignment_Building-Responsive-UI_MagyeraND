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
