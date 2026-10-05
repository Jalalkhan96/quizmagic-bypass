# GitHub upload

Repository: https://github.com/Jalalkhan96/quizmagic-bypass

## Clone the repository

```bash
gh repo clone Jalalkhan96/quizmagic-bypass
cd quizmagic-bypass
```

If GitHub CLI (`gh`) is not installed, use:

```bash
git clone https://github.com/Jalalkhan96/quizmagic-bypass.git
cd quizmagic-bypass
```

## Replace/add the extension files

Copy the contents of this folder into the cloned repository root. Keep the `icons/` directory and all `.js`, `.html`, `.css`, and `.json` files.

## Commit and push

```bash
git add .
git commit -m "Release QuizMagic extension v1.4.0"
git push origin main
```

With GitHub CLI authentication:

```bash
gh auth login
git push origin main
```

## Verify

After pushing, open:
https://github.com/Jalalkhan96/quizmagic-bypass

The repository should contain `manifest.json`, `popup.html`, `popup.js`, `shield.js`, `common.js`, `content.js`, `overlay.css`, the `icons/` folder, and the documentation files.
