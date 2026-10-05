# QuizMagic Answer Fetcher — Detailed Extension Documentation

**Version:** 1.4.0  
**Manifest:** Chrome Manifest V3  
**Extension name:** QuizMagic Answer Fetcher  
**Primary page:** `https://quizmagic.io/session/*`  
**GitHub:** https://github.com/Jalalkhan96

---

## 1. Overview

QuizMagic Answer Fetcher is a lightweight Chrome/Chromium extension interface for retrieving and displaying QuizMagic session answers inside the browser extension popup.

The current version is designed around a strict **extension-only UI** model:

- The extension popup is the main user interface.
- No answer popup is injected into the QuizMagic webpage.
- No floating answer button appears on the webpage.
- Answers are displayed inside the extension popup.
- The popup remembers the user's last answer position for each quiz session.
- Reopening the extension resumes from the previous question position instead of starting at Question 1.
- A small GitHub icon is displayed at the top of the popup.
- Updated QuizMagic extension icon assets are included in the package.

---

## 2. Main UI Design

The popup uses a compact card-based layout intended to remain readable while consuming minimal screen space.

### Header

The top section contains:

1. QuizMagic logo
2. Extension title: `QuizMagic Answers`
3. Subtitle: `Resume where you left off`
4. Small GitHub icon

The GitHub icon opens:

`https://github.com/Jalalkhan96`

The icon is intentionally small so the header stays compact.

### URL / Fetch Row

The main control row contains:

- QuizMagic session URL input
- **Fetch** button
- Refresh/re-fetch button

The refresh button ignores the cached answer result and requests fresh data.

### Status Area

The status section displays:

- Fetching state
- Re-fetching state
- Validation messages
- Error messages
- Successful empty status

### Resume Indicator

When a previous scroll position exists, the popup displays a small resume indicator such as:

`Resume at Q10 of 50`

The **Top** control resets the current result view back to the first question.

### Answer List

Questions are displayed as individual cards containing:

- Question number
- Question type
- Question text
- Correct option
- Correct answer text

The currently visible question is visually highlighted.

---

## 3. Important UI Behavior: No Webpage Overlay

The current design deliberately does **not** inject answer UI into QuizMagic pages.

The extension no longer creates:

- Floating Answers button
- Bottom answer drawer
- Bottom answer popup
- Persistent answer overlay
- Extra page-level control panel

The page remains visually clean and untouched by the extension UI.

The popup is the only answer interface.

### Content script behavior

`content.js` is intentionally empty in v1.4.0:

```text
/* Intentionally empty in v1.4.0: no page UI is injected. */
```

This keeps webpage UI changes disabled while retaining the extension architecture.

---

## 4. Resume / Position Memory

A major feature of v1.4.0 is persistent answer-list position memory.

### User scenario

Example:

1. Open a QuizMagic session.
2. Open the QuizMagic extension.
3. Fetch the answers.
4. Scroll down until Question 10 is visible.
5. Close the extension popup.
6. Open the extension popup again.
7. The popup restores the previous position and resumes around Question 10.

The user does not have to manually scroll from Question 1 every time.

### Per-quiz storage

Positions are saved separately for each QuizMagic share/session ID.

The storage key format is:

```text
qm_popup_position_<share-id>
```

The saved information includes:

```json
{
  "scrollTop": 1234,
  "question": 10,
  "savedAt": 1791180000000
}
```

### Why the position is stored by quiz

This prevents one quiz's position from overwriting another quiz's position.

For example:

```text
Quiz A → Resume at Q10
Quiz B → Resume at Q4
Quiz C → Resume at Q22
```

Each session can therefore maintain its own position.

### Save timing

Scroll updates are debounced before writing to storage. This avoids writing on every single pixel movement and reduces unnecessary storage operations.

### Restore behavior

When answers are rendered:

1. The stored position is read.
2. The resume indicator is displayed.
3. The answer list is restored after rendering.
4. The saved `scrollTop` is applied.
5. The corresponding question is marked as active.

---

## 5. Reset to Top

The **Top** control resets the current answer list to the beginning.

After reset:

- Scroll position becomes `0`.
- Question 1 becomes the active question.
- Stored position for the current quiz is updated.
- Resume indicator changes to Question 1.

This gives the user an explicit way to restart the reading position.

---

## 6. Shuffle Warning

The extension detects when the fetched result indicates question or option randomization.

Possible warning states include:

```text
questions
```

or:

```text
options
```

or both.

When shuffling is detected, the UI warns the user to match answers by **text**, rather than blindly trusting option letters.

This is important because the original answer order may not match the order displayed in a randomized quiz.

---

## 7. Cache / Fresh Fetch Behavior

The extension supports normal fetching and forced re-fetching.

### Fetch

Uses the normal answer retrieval flow and can use the existing cache behavior exposed by `common.js`.

### Re-fetch

The circular refresh button triggers a forced refresh.

The UI displays:

```text
Re-fetching answers…
```

while the operation is running.

This allows the user to deliberately bypass cached data when needed.

---

## 8. GitHub Button

The popup header includes a small GitHub icon.

Current destination:

```text
https://github.com/Jalalkhan96
```

The click handler creates a new browser tab using:

```javascript
chrome.tabs.create({ url: GITHUB_URL })
```

The button is intentionally compact and does not consume significant header space.

---

## 9. Extension Logo / Icon

The package includes updated icon assets in:

```text
icons/
```

Current icon sizes:

```text
icon16.png
icon32.png
icon48.png
icon128.png
```

These are used for Chrome's extension UI and browser extension identity.

The popup also uses the `icon32.png` asset as the compact brand logo in the popup header.

---

## 10. Package Structure

The v1.4.0 extension contains:

```text
QuizMagic Answer Fetcher/
├── manifest.json
├── popup.html
├── popup.js
├── common.js
├── shield.js
├── content.js
├── overlay.css
├── README.md
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## 11. File Responsibilities

### `manifest.json`

Defines:

- Manifest V3 configuration
- Extension name and version
- Popup entry point
- Permissions
- Host permissions
- Extension icons
- QuizMagic session content script

Version:

```text
1.4.0
```

### `popup.html`

Defines the popup interface, including:

- Header
- Logo
- GitHub button
- Session URL input
- Fetch control
- Refresh control
- Status area
- Resume indicator
- Results container
- Popup styling

### `popup.js`

Controls the popup behavior, including:

- Fetching answers
- Rendering question cards
- Tracking visible question
- Saving scroll position
- Restoring scroll position
- Showing resume information
- Resetting to top
- GitHub navigation
- Error handling

### `common.js`

Contains shared answer/session retrieval functionality used by the popup.

### `shield.js`

The existing main-world content script support remains available according to the original extension architecture.

### `content.js`

Currently contains no webpage UI injection.

This is deliberate.

### `overlay.css`

The file remains in the package for compatibility with the existing structure, but the current popup does not inject the previous webpage answer overlay.

### `README.md`

Contains the compact package-level installation and feature summary.

---

## 12. Permissions

The current manifest declares:

```json
"permissions": [
  "activeTab",
  "storage"
]
```

### `activeTab`

Used to inspect the currently active browser tab and determine whether it contains a QuizMagic session URL.

### `storage`

Used to persist popup resume positions for individual quiz sessions.

The extension also declares host permissions for:

```text
https://quizmagic.io/*
https://htjjpxmcmixhejmobxkh.supabase.co/*
```

These support the existing QuizMagic answer retrieval architecture.

---

## 13. Popup Startup Flow

When the extension icon is clicked:

```text
Chrome Extension Icon
        ↓
Popup Opens
        ↓
Read Active Browser Tab
        ↓
Check for QuizMagic Session URL
        ↓
Extract Share ID
        ↓
Fetch / Load Existing Answers
        ↓
Render Questions
        ↓
Read Saved Position
        ↓
Restore Previous Scroll Position
        ↓
Highlight Current Question
```

If the current tab is not a QuizMagic session, the user can manually paste a session URL.

---

## 14. Scroll Tracking Flow

The position system works as follows:

```text
User Scrolls
    ↓
Scroll Event
    ↓
Find Visible Question
    ↓
Update Active Question
    ↓
Debounce Save
    ↓
chrome.storage.local
    ↓
Save scrollTop + question number
```

When the popup is opened again:

```text
Popup Opens
    ↓
Load Quiz
    ↓
Read qm_popup_position_<share-id>
    ↓
Render Questions
    ↓
Restore scrollTop
    ↓
Resume at Previous Question
```

---

## 15. User Experience Goals

The current UI is optimized around these principles:

### Minimal webpage interference

QuizMagic pages should remain visually clean.

### Small popup footprint

The interface avoids unnecessary large controls and extra windows.

### Fast resume

Users can close and reopen the popup without losing their place.

### Clear answer hierarchy

Question text and correct answer are visually separated.

### Visible current position

The active question is highlighted while scrolling.

### Easy refresh

Fresh answer retrieval can be triggered directly from the popup.

---

## 16. Installation

### Chrome / Chromium / Edge

1. Extract the ZIP file.
2. Open:

```text
chrome://extensions
```

For Microsoft Edge, use:

```text
edge://extensions
```

3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the extracted extension folder.
6. Pin the QuizMagic extension to the browser toolbar if desired.

### Updating an existing installation

When replacing an earlier development build:

1. Open the extensions page.
2. Remove or reload the old unpacked version.
3. Load the new extracted folder.
4. Reopen the QuizMagic session.

The extension version is currently:

```text
1.4.0
```

---

## 17. Using the Extension

### Method 1 — Open from a QuizMagic session

1. Open a QuizMagic session page.
2. Click the QuizMagic extension icon.
3. The extension detects the active session URL.
4. Click **Fetch** if answers have not already been loaded.
5. Scroll through the answers.

### Method 2 — Paste a session URL

1. Open the extension.
2. Paste a QuizMagic session URL into the input field.
3. Click **Fetch**.

Expected URL pattern:

```text
https://quizmagic.io/session/<share-id>
```

---

## 18. Resume Example

Suppose the quiz has 50 questions.

The user reaches Question 10:

```text
Q10
```

Then closes the extension popup.

Later, the user opens the extension again.

The extension reads the stored position and displays:

```text
Resume at Q10 of 50
```

The results list is positioned around Question 10.

The user can continue scrolling from there.

---

## 19. Data Storage

The resume feature uses Chrome's local extension storage.

Example key:

```text
qm_popup_position_abc123
```

Example value:

```json
{
  "scrollTop": 1432,
  "question": 10,
  "savedAt": 1791180000000
}
```

No separate database is required for the resume position feature.

---

## 20. Important Distinction: Popup vs Webpage

There are two different UI environments:

### Browser extension popup

This is where the answers are displayed.

```text
Extension Icon
     ↓
Extension Popup
     ↓
Answer List
```

### QuizMagic webpage

The extension does not add an answer panel to the webpage.

```text
QuizMagic Webpage
     ↓
No injected answer UI
```

This distinction is intentional and should be preserved in future updates unless webpage UI injection is explicitly requested.

---

## 21. Troubleshooting

### Extension does not open

Check that the extension is loaded through `chrome://extensions` with Developer mode enabled.

### Popup opens but no answers appear

Verify that the current tab is a valid QuizMagic session or paste the session URL manually.

### Resume position does not change

Scroll inside the **answer list area of the extension popup**, not the underlying webpage. The saved position belongs to the popup's result container.

### Resume starts from an unexpected location

Use the **Top** control to reset the saved position for that quiz.

Then scroll to the desired question again.

### GitHub button does not appear

Reload the unpacked extension from the browser extensions page and reopen the popup.

### Old floating answer popup still appears

Make sure an older QuizMagic Answer Fetcher build is not also installed or injected. The v1.4.0 package's `content.js` does not inject a webpage answer panel.

---

## 22. Development Notes

### Current version

```text
1.4.0
```

### Main UI files

```text
popup.html
popup.js
```

### Main storage API

```javascript
chrome.storage.local
```

### Position key prefix

```javascript
qm_popup_position_
```

### GitHub destination

```javascript
https://github.com/Jalalkhan96
```

---

## 23. Future UI Guidelines

For future UI-only updates, preserve these rules unless explicitly changed:

1. Do not add a webpage-level answer popup.
2. Do not add a floating answer button to QuizMagic pages.
3. Keep answers inside the extension popup.
4. Preserve per-quiz resume position.
5. Keep the popup compact.
6. Keep the GitHub icon in the top header.
7. Keep extension icon assets synchronized across 16px, 32px, 48px, and 128px sizes.
8. Avoid unnecessary extra browser windows or overlays.

---

## 24. Version History

### v1.4.0

- Added small GitHub icon to the popup header.
- Updated extension logo/icon assets.
- Added per-quiz scroll position persistence.
- Added resume indicator.
- Added Top/reset control.
- Removed webpage answer UI injection.
- Kept answer results inside the extension popup.
- Preserved existing answer fetching and refresh flow.

### Previous UI direction

Earlier builds used webpage-level answer UI. That approach is no longer used by v1.4.0.

---

## 25. Final Feature Summary

| Feature | v1.4.0 |
|---|---:|
| Extension popup UI | ✅ |
| Quiz answer display | ✅ |
| Fetch button | ✅ |
| Force refresh | ✅ |
| GitHub icon | ✅ |
| Updated extension icon | ✅ |
| Per-quiz resume position | ✅ |
| Resume after popup close/reopen | ✅ |
| Current question highlight | ✅ |
| Top/reset position | ✅ |
| Shuffle warning | ✅ |
| Webpage floating answer button | ❌ Removed |
| Webpage bottom answer popup | ❌ Removed |
| Extra answer overlay on QuizMagic page | ❌ Removed |

---

## 26. Package Identity

**Name:** QuizMagic Answer Fetcher  
**Version:** 1.4.0  
**Manifest:** V3  
**UI model:** Extension-popup only  
**Resume model:** Per-session local storage  
**Repository:** https://github.com/Jalalkhan96

