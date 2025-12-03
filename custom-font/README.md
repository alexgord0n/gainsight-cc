# Using Custom Fonts in Gainsight Customer Community

This repository hosts web font files for use in Gainsight Customer Community environments (e.g., `Super Chiby.ttf`).

## 📁 Font Hosting Setup

### 1. Upload Your Fonts
Upload `.woff2`, `.woff`, or `.ttf` files to this repository.  
Each font file should be located in the main branch or a folder like `/fonts/`.

Example file structure:
```
/fonts/
  Super Chiby.ttf
```

### 2. URL Structure
Use the **raw.githubusercontent.com** format — *not* the `github.com/.../raw` link.

✅ Correct:
```
https://raw.githubusercontent.com/<username>/<repo>/main/<path-to-font>/<font-name>.ttf
```

Example:
```
https://raw.githubusercontent.com/alexgord0n/font/main/Super%20Chiby.ttf
```

⚠️ Incorrect (won’t load in browsers):
```
https://github.com/alexgord0n/font/raw/refs/heads/main/Super%20Chiby.ttf
```

---

## 🧩 Community Configuration Steps

### Step 1. Enable GitHub Pages (optional but recommended)
This ensures better caching and CORS handling.

1. Go to **Settings → Pages**
2. Under *Build and deployment*, set:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` → `/ (root)` or `/fonts`
3. Save, then use the new Pages URL for your font file:
   ```
   https://<username>.github.io/<repo>/<font-name>.ttf
   ```

---

## 🎨 Step 2. Add the @font-face Rule

In your Gainsight **Community Admin**, navigate to:
**Settings → Third-Party Scripts → "<HEAD>"**

Paste the following inside a `<style>` block:

```html
<style>
@font-face {
  font-family: 'Super Chiby';
  src: url('https://raw.githubusercontent.com/alexgord0n/font/main/Super%20Chiby.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
```

---

## 🖋️ Step 3. Apply the Font

Go to **Style → Fonts** in the Community Admin area,  
and set `'Super Chiby'` as the desired font for your headings, body text, etc.

---

## 🧠 Notes & Tips
- If possible, convert `.ttf` to `.woff2` for faster load times.
- Always verify font loading via **Network tab** in browser DevTools.
- For fallback safety:
  ```css
  font-family: 'Super Chiby', 'Helvetica Neue', sans-serif;
  ```
- You can host multiple fonts — just duplicate the `@font-face` block for each.

---

### Example Full HTML Snippet
```html
<style>
@font-face {
  font-family: 'Super Chiby';
  src: url('https://raw.githubusercontent.com/alexgord0n/font/main/Super%20Chiby.ttf') format('truetype');
}
body {
  font-family: 'Super Chiby', sans-serif;
}
</style>
```

---

## 🧾 Summary

| Step | Action | Location |
|------|---------|-----------|
| 1 | Host font in GitHub repo | `/fonts` folder or root |
| 2 | Use raw.githubusercontent.com URL | ✅ |
| 3 | Add @font-face block in `<HEAD>` | Settings → Third-Party Scripts |
| 4 | Select font in Style settings | Style → Fonts |
| 5 | (Optional) Enable GitHub Pages | Settings → Pages |

---

**Author:** [Alex Gordon](https://github.com/alexgord0n)  
**Purpose:** Guide for using self-hosted custom fonts in Gainsight Customer Community.
