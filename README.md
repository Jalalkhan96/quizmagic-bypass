# 🎯 QuizMagic Answer Fetcher — v1.4.0

A lightweight Manifest V3 Chromium extension that opens a clean popup for viewing quiz-session questions and their fetched answer data.

**GitHub:** https://github.com/Jalalkhan96/quizmagic-bypass

---

## ✨ What this version includes

### Popup-only interface
- Answers are displayed inside the extension popup.
- No floating **Answers** button is injected into the QuizMagic page.
- No bottom answer panel or extra answer overlay is injected into the webpage.
- The QuizMagic webpage is left visually clean.

### Resume position
- The popup remembers your last scroll position for each quiz session.
- The saved position is stored locally in `chrome.storage.local`.
- Example: reach Q10, close the extension popup, then open it again; the popup resumes around the saved question.
- The **Resume at Q…** indicator shows the saved question when a previous position exists.
- The **Top** button resets the current quiz view to the beginning.

### GitHub access
- A small GitHub icon appears at the top-right of the extension UI.
- Clicking it opens:
  `https://github.com/Jalalkhan96/quizmagic-bypass`

### Quiz answer loading
- Paste a `quizmagic.io/session/...` URL or open a supported quiz session in the active browser tab.
- Click **Fetch** to load the quiz data.
- Use **↻ Re-fetch** to bypass the local 5-minute cache and request fresh data.
- A cache status is shown when cached results are used.

### Shuffle warning
When the session reports shuffled questions or options, the popup displays a warning so answers can be interpreted against the correct question/option text rather than assuming that the displayed letter order is unchanged.

---

## 📦 Extension contents

```text
quizmagic-bypass-local/
├── manifest.json
├── popup.html
├── popup.js
├── common.js
├── shield.js
├── content.js
├── overlay.css
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── README.md
├── QUIZMAGIC_EXTENSION_DETAILS.md
└── GITHUB_UPLOAD.md
```

### File purpose

| File | Purpose |
|---|---|
| `manifest.json` | Manifest V3 configuration, permissions, host permissions, popup, and icon definitions. |
| `popup.html` | Main extension popup UI and styling. |
| `popup.js` | Popup behavior, fetching controls, rendering, GitHub button, and resume-position logic. |
| `common.js` | Shared session parsing, API request logic, answer mapping, and 5-minute cache helpers. |
| `shield.js` | Runs on supported QuizMagic session pages at document start. |
| `content.js` | Intentionally empty in v1.4.0; no page answer UI is injected. |
| `overlay.css` | Legacy styling file kept with the package; v1.4.0 does not inject the old answer panel. |
| `icons/` | Extension logo/icon assets used by the browser and popup branding. |
| `QUIZMAGIC_EXTENSION_DETAILS.md` | Detailed technical documentation for this release. |
| `GITHUB_UPLOAD.md` | Git commands for publishing the local files to GitHub. |

---

# 🚀 Installation

## Method 1 — Chrome / Chromium browsers

This extension is intended to be loaded as an **unpacked extension** during local development or personal use.

### Step 1: Download the project

Download or clone this repository:

```bash
git clone https://github.com/Jalalkhan96/quizmagic-bypass.git
cd quizmagic-bypass
```

You can also download the ZIP from GitHub and extract it.

### Step 2: Make sure the extension folder is ready

The folder you select in the browser must contain `manifest.json` directly inside it.

Correct:

```text
quizmagic-bypass/
├── manifest.json
├── popup.html
├── popup.js
└── ...
```

Do **not** select a parent directory that only contains another nested extension folder.

### Step 3: Open the extensions page

In Chrome, open:

```text
chrome://extensions
```

For other Chromium browsers, open their equivalent extensions-management page.

### Step 4: Enable Developer mode

Turn **Developer mode** ON.

### Step 5: Load the extension

1. Click **Load unpacked**.
2. Select the folder that contains `manifest.json`.
3. The extension should appear in the installed extensions list.

### Step 6: Pin the extension

Open the browser's extension/puzzle menu and pin **QuizMagic Answer Fetcher** so the icon remains visible in the toolbar.

---

# 🌐 Supported browser setup

The package uses **Manifest V3** and standard Chromium extension APIs such as `chrome.storage`, `chrome.tabs`, and the extension popup system.

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Brave
- Other Chromium-based browsers that support Manifest V3

The extension package has not been documented here as a Firefox-specific build. Use a Chromium browser unless you have separately tested compatibility with your target browser.

---

# ▶️ How to use

## Option A — Open the quiz first

1. Open a supported QuizMagic session in the browser.
2. Click the **QuizMagic Answer Fetcher** extension icon.
3. The popup detects the active `quizmagic.io/session/...` URL automatically.
4. The popup fetches the quiz data.
5. Scroll through the questions in the extension popup.

## Option B — Paste a session URL

1. Open the extension popup.
2. Paste a supported session URL into the URL field.
3. Click **Fetch**.

Example format:

```text
https://quizmagic.io/session/ABC123
```

The extension extracts the session code from the URL and uses it to request the associated quiz data.

## Refresh data

Click the **↻** button when you need to ignore the existing local cache and request the quiz data again.

The normal fetch path uses a **5-minute local cache** to avoid unnecessary repeated requests.

---

# 📍 Resume / scroll behavior

The popup stores the last visible question for each quiz session.

### Example

```text
Open quiz
   ↓
Fetch answers
   ↓
Scroll to Q10
   ↓
Close popup
   ↓
Open extension again
   ↓
Resume around Q10
```

The saved state includes:

- quiz/session identifier
- popup scroll position
- question number
- save timestamp

### Reset to the beginning

Click **Top** in the resume bar.

This sets the current popup view back to the beginning and updates the saved position.

### Important

Resume state is stored separately for each detected quiz session, so opening a different session does not intentionally overwrite the previous session's position.

---

# 🎨 Extension UI

The popup was designed to remain compact and avoid unnecessary webpage UI.

The top area contains:

```text
[QuizMagic Logo]  QuizMagic Answers                         [GitHub]
                  Resume where you left off
```

The main controls contain:

```text
[ session URL / input field ] [Fetch] [↻]
```

Then:

```text
[status]
[Resume at Q10 of 20]                         [Top]

Q1  ...
✓  Answer

Q2  ...
✓  Answer

...
```

There is intentionally **no floating answer control and no bottom answer popup on the QuizMagic webpage** in v1.4.0.

---

# 🔐 Permissions explained

The current `manifest.json` declares these extension permissions:

```json
"permissions": [
  "activeTab",
  "storage"
]
```

### `activeTab`

Allows the extension to work with the currently active browser tab when the user invokes it.

### `storage`

Used for local extension data such as:

- cached quiz results
- saved popup scroll/question position

The extension also declares host access for the QuizMagic website and the configured Supabase backend used for fetching quiz-session data.

```json
"host_permissions": [
  "https://quizmagic.io/*",
  "https://htjjpxmcmixhejmobxkh.supabase.co/*"
]
```

---

# 🧩 Technical flow

At a high level, v1.4.0 works like this:

```text
Active QuizMagic Session / Pasted URL
                 │
                 ▼
        Extract session ID
                 │
                 ▼
       Check local 5-min cache
           │             │
       cache hit       cache miss / refresh
           │             │
           └──────┬──────┘
                  ▼
          Fetch session data
                  │
                  ▼
         Build question records
                  │
                  ▼
           Render popup cards
                  │
                  ▼
      Track popup scroll position
                  │
                  ▼
       Save position to storage
```

The popup logic is primarily implemented in `popup.js`, while shared data/request logic is in `common.js`.

---

# 🛠️ Development / editing

No build system is required for the current package. The extension is composed of standard HTML, JavaScript, CSS, JSON, and PNG assets.

You can edit the files directly and then reload the extension from the browser's extensions page.

## Reload after code changes

After editing any extension source file:

1. Open `chrome://extensions`.
2. Find **QuizMagic Answer Fetcher**.
3. Click **Reload**.
4. Close and reopen the popup if it was already open.

For major manifest changes, reload the extension and re-check the browser's extension error panel.

---

# 🧪 Troubleshooting

## The extension does not appear

Check that:

1. Developer mode is enabled.
2. You selected the folder containing `manifest.json`.
3. Chrome/your browser shows the extension without a manifest error.

## “Manifest file is missing”

You selected the wrong folder.

Select the directory where this file exists directly:

```text
manifest.json
```

## Popup opens but does not detect the quiz

Make sure the active page is a supported QuizMagic session URL matching:

```text
https://quizmagic.io/session/<session-id>
```

You can also paste the session URL into the popup manually.

## Fetch fails

Common causes include:

- the session is invalid
- the session is inactive or unavailable
- the network request failed
- the configured backend endpoint is unavailable
- the remote API response changed

Use **↻ Re-fetch** to retry without using the local 5-minute cache.

## The popup resets to the top

The resume position is stored per session in `chrome.storage.local`.

Check:

1. You are reopening the same quiz session.
2. The extension still has access to local storage.
3. You did not click **Top**.
4. The extension was not removed/reinstalled, which can clear extension-local storage depending on the browser state.

## GitHub icon does not open the repository

The icon is configured to open:

```text
https://github.com/Jalalkhan96/quizmagic-bypass
```

Check that the browser allows the extension popup to create a new tab.

## Old bottom answer UI still appears

v1.4.0 includes:

```text
content.js = intentionally empty
```

and does not intentionally inject the former answer panel or floating answer button.

If an old UI remains visible after updating:

1. Reload the extension from `chrome://extensions`.
2. Refresh the QuizMagic webpage.
3. Close and reopen the extension popup.
4. Confirm that the old version is not still installed alongside v1.4.0.

---

# 🔄 Updating from an older version

If you already installed an older unpacked copy:

1. Replace/update the extension source files with this version.
2. Open `chrome://extensions`.
3. Click **Reload** on the extension.
4. Refresh the QuizMagic page.
5. Reopen the popup.

Avoid installing two copies with nearly identical names at the same time because it can make testing confusing.

---

# 🗂️ GitHub workflow

## Clone the repository

```bash
git clone https://github.com/Jalalkhan96/quizmagic-bypass.git
cd quizmagic-bypass
```

## Check the files

```bash
git status
git branch
```

## Add the extension files

```bash
git add .
```

## Commit

```bash
git commit -m "Release QuizMagic extension v1.4.0"
```

## Push

```bash
git push origin main
```

If your repository uses another default branch, replace `main` with that branch.

---

# 🧰 GitHub CLI workflow

If you use GitHub CLI (`gh`):

```bash
gh auth login
gh repo clone Jalalkhan96/quizmagic-bypass
cd quizmagic-bypass
```

Copy/update the extension files, then:

```bash
git add .
git commit -m "Release QuizMagic extension v1.4.0"
git push origin main
```

---

# 📋 Release checklist

Before publishing a new release, verify:

- [ ] `manifest.json` is valid JSON.
- [ ] Extension version is updated when appropriate.
- [ ] `popup.html` loads without console errors.
- [ ] `popup.js` loads without console errors.
- [ ] GitHub icon points to the correct repository.
- [ ] Browser toolbar icon is displayed correctly.
- [ ] No old floating answer button appears on the QuizMagic webpage.
- [ ] No old bottom answer panel appears on the QuizMagic webpage.
- [ ] Fetch works with a valid session URL.
- [ ] Re-fetch bypasses the 5-minute cache.
- [ ] Resume position survives closing/reopening the popup.
- [ ] **Top** resets the saved position.
- [ ] The extension works after a browser reload.

---

# 📌 Version information

**Version:** `1.4.0`

### v1.4.0 highlights

- Compact popup UI refresh.
- GitHub repository icon in the popup header.
- Updated QuizMagic branding/icons.
- Removed injected webpage answer UI.
- Added per-session popup scroll/question resume behavior.
- Added visible resume state and **Top** reset control.
- Kept the local 5-minute result cache and manual re-fetch control.

---

# 📄 Additional documentation

For deeper implementation details, see:

- [`QUIZMAGIC_EXTENSION_DETAILS.md`](./QUIZMAGIC_EXTENSION_DETAILS.md)
- [`GITHUB_UPLOAD.md`](./GITHUB_UPLOAD.md)

---

## ⚠️ Notes

This repository is provided as a local/unpacked browser-extension project. Browser behavior, remote APIs, and the QuizMagic website can change independently of the extension code. Test the extension after browser updates or changes to the remote session/API behavior.

Use the extension only where you have permission to access and process the relevant quiz/session data, and follow the policies or rules that apply to the platform and assessment you are using.

---

## 👤 Repository

**Jalalkhan96/quizmagic-bypass**  
https://github.com/Jalalkhan96/quizmagic-bypass
