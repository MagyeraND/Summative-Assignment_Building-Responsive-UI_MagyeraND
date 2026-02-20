# Campus Cash Calc — Student Finance Tracker

> **Summative Assignment — Building Responsive UI**
> Chosen Theme: **Student Finance Tracker**
> Live Demo: [https://magyerand.github.io/Summative-Assignment_Building-Responsive-UI_MagyeraND/](https://magyerand.github.io/Summative-Assignment_Building-Responsive-UI_MagyeraND/)

---

## Features

| Area | What's included |
|---|---|
| **Dashboard** | Total records, total spent, top category, budget-left stat card, 7-day trend chart, ARIA live budget alert |
| **Records Table** | All transactions in a sortable table; card layout on mobile |
| **Add / Edit Form** | Live inline validation on blur; pre-filled edit mode per row; confirm-delete |
| **Search** | Live regex search with `try/catch` compiler; case-insensitive toggle; `<mark>` highlights |
| **Sort** | Date ↑↓, Description A↕Z, Amount ↑↓ |
| **Settings** | Budget cap, base currency (RWF / USD), manual exchange rate, custom category list |
| **Import / Export** | JSON round-trip with structure validation before loading |
| **Persistence** | Auto-save to `localStorage` on every mutation |
| **Accessibility** | Skip link, ARIA landmarks, live regions, visible focus, keyboard-only flow |
| **Responsive** | Mobile-first; breakpoints at ~360 px, 768 px, 1024 px |

---

## Regex Catalog

### Validation Patterns

| Rule | Pattern | Example — passes | Example — fails |
|---|---|---|---|
| **R1 Description** | `/^\S(?:.*\S)?$/` | `"Lunch at cafeteria"` | `" Lunch"` (leading space) |
| **R1 Advanced — duplicate word** | `/\b(\w+)\s+\1\b/i` (back-reference) | — | `"the the cafeteria"` |
| **R2 Amount** | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | `"12.50"`, `"1500"` | `"12.500"`, `"-5"` |
| **R3 Date** | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | `"2026-02-15"` | `"2026-13-01"`, `"15-02-2026"` |
| **R4 Category** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | `"Food"`, `"Self-care"` | `"Food123"`, `""` |
| **R5 Budget** | Same as R2 (optional field) | `"50000"` | `"-10"` |

### Search Patterns (typed in the search bar)

| Pattern | Matches |
|---|---|
| `(coffee\|tea)` | Any record mentioning coffee or tea |
| `\.\d{2}\b` | Amounts with cents e.g. `12.50` |
| `\b(\w+)\s+\1\b` | Descriptions with an accidentally repeated word |
| `^Bus` | Records whose description starts with "Bus" |
| `[Ff]ee` | "fee", "Fee", "fees" etc. |

---

## Keyboard Map

| Key / Combo | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move between interactive elements |
| `Enter` / `Space` | Activate focused button or link |
| `Alt+1` … `Alt+5` | Jump to Dashboard / Records / Add / Settings / About *(via nav links)* |
| Arrow keys | Move within `<select>` dropdowns |
| `Escape` | Cancel edit form and return to Records |
| Skip-link `Tab` then `Enter` | Jump straight to `#main-content` |

---

## Accessibility Notes

- **Landmarks**: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` used throughout.
- **Headings**: Single `<h1>` per section; `<h2>` for sub-sections (trend chart, fieldsets).
- **Labels**: Every `<input>` and `<select>` has a bound `<label>` (`for`/`id` pair).
- **Focus styles**: `:focus-visible` outline in `--lime` colour; skip-to-content link visible on focus.
- **ARIA live regions**:
  - `role="status"` + `aria-live="polite"` — success messages, saved confirmations.
  - `role="alert"` + `aria-live="assertive"` — over-budget warning.
- **Error feedback**: `aria-invalid="true"` + `aria-describedby` pointing to `.field-error` span on invalid fields.
- **Colour contrast**: All foreground/background pairs checked to meet WCAG AA.
- **Keyboard-only flow**: Full add → save → edit → delete cycle completable without a mouse.

---

## Running Tests

1. Open `tests.html` in any modern browser (no server needed).
2. The page auto-runs all assertion suites and displays a pass/fail table.

| Suite | Validator tested |
|---|---|
| R1 — Description | `validateDescription()` |
| R2 — Amount | `validateAmount()` |
| R3 — Date | `validateDate()` |
| R4 — Category | `validateCategory()` |
| R5 — Search regex | `compileSearchRegex()` |

---

## Running Locally

```bash
# No build step needed — just open the file
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

Or serve over a local server to avoid any file-protocol quirks:

```bash
npx serve .
```

---

## File Structure

```
├── index.html              # Main SPA shell
├── tests.html              # Automated validator test suite
├── seed.json               # ≥10 diverse sample records
├── styles/
│   └── main.css            # Mobile-first CSS (variables, layout, components)
└── scripts/
    ├── storage.js          # localStorage read/write wrapper
    ├── state.js            # In-memory store + CRUD + getStats()
    ├── validators.js       # All regex validators + compileSearchRegex
    ├── search.js           # Sort, filter, highlight, search event wiring
    └── ui.js               # Navigation, render functions, form, settings
```

---

## Data Model

```json
{
  "id":          "rec_0001",
  "description": "Lunch at cafeteria",
  "amount":      1500,
  "category":    "Food",
  "date":        "2026-02-13",
  "createdAt":   "2026-02-13T10:00:00.000Z",
  "updatedAt":   "2026-02-13T10:00:00.000Z"
}
```

---

## Author

**David Nkubito**
- GitHub: [github.com/MagyeraND](https://github.com/MagyeraND)
- Email: [d.nkubito1@gmail.com](mailto:d.nkubito1@gmail.com)

---

*Built with vanilla HTML5, CSS (mobile-first), and JavaScript — no frameworks.*
