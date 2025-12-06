# Gainsight CC – Schedule-X Calendar Event View

This folder contains **copy-paste HTML widgets** you can paste directly into a **Gainsight Customer Community (CC)** HTML widget to render a modern Schedule‑X powered calendar.

Two versions are included:

- **calendar-brand-widget.html** — calendar colors follow your **brand color** (`--config--main-color-brand`)
- **calendar-cta-widget.html** — calendar colors follow your **primary CTA button** (`--config-button-cta-background-color`)

Both versions:
- Render **Month / Week / Day** views with Schedule‑X  
- Pull events securely using **CC Secure API Connectors**  
- Convert CC timestamps into proper Schedule-X timed events  
- Open community events using `/events/{id}` in the same tab  
- Match CC UI styling using built‑in CSS variables  

You do **not** need to host JS/CSS separately or build bundles.  
Just copy the HTML from the file you want and paste it into an HTML widget.

---

## 🚀 How to Use

### 1. Pick a widget flavor  
Choose which theme logic you want:

- **Brand‑driven UI** → use `calendar-brand-widget.html`  
- **CTA‑driven UI** → use `calendar-cta-widget.html`  

Both can be swapped anytime by replacing the widget’s contents.

### 2. Copy the full widget  
Open the file in GitHub → click **Raw** → copy **all** HTML.

### 3. Paste into a CC HTML widget  
In Gainsight CC:

1. Navigate to the page where you want the calendar (typically Events Overview)  
2. Add or edit an **HTML widget**  
3. Paste the full widget HTML  
4. Save & publish  

The calendar loads automatically once Schedule‑X and the WidgetServiceSDK initialize.

---

## 🔧 Requirements

### A secure CC connector named `get-calendar-events`

Your connector should:

- Have permalink: `get-calendar-events`  
- Use method: `GET`  
- Return JSON like:

```json
{
  "result": [
    {
      "id": "6",
      "title": "Grow Boldly with Next‑Gen CPM",
      "startDate": "2025-11-06T01:00:00-07:00",
      "endDate": "2025-11-06T02:00:00-07:00",
      "url": "",
      "externalRegistrationUrl": "https://example.com/register"
    }
  ],
  "_metadata": {
    "totalCount": 1,
    "offset": 0,
    "limit": 0
  }
}
```

The widget maps:
- `id`  
- `title`  
- `startDate`, `endDate`  
- `url` or `externalRegistrationUrl` (fallback)  

---

## 🖱 Interaction Behavior

Clicking an event navigates to your built‑in CC event page:

```
https://<community-domain>/events/<id>
```

This guarantees compatibility even if the connector doesn’t return the internal URL.

---

## 🎨 Theming (Brand vs CTA)

### Brand Version
- Uses `--config--main-color-brand` as the primary accent
- Best when brand color = the main identity of the community UI

### CTA Version
- Uses `--config-button-cta-background-color`  
- Best if your community heavily emphasizes CTA button styling as the accent color

Both rely exclusively on CC global CSS variables.  
Changing your community’s theme automatically updates the calendar colors.

---

## 🧩 Calendar Behavior

Each widget file:

- Creates the container `<div id="gs-calendar">`
- Loads all required Schedule‑X + Preact CDN scripts
- Loads WidgetServiceSDK
- Fetches event data via your connector
- Converts timestamps (`YYYY-MM-DDTHH:mm:ssZ`) → Schedule‑X (`YYYY-MM-DD HH:mm`)
- Renders Month / Week / Day views
- Opens events by ID in the same tab

---

## 🛠 Optional Adjustments

### Default view  
Change this block in the script:

```js
var defaultViewName =
  (viewWeek && viewWeek.name) ||
  (viewMonthGrid && viewMonthGrid.name) ||
  views[0].name;
```

To default to **Month**, use:

```js
var defaultViewName = 'month-grid';
```

### Calendar height  
In the CSS:

```css
#gs-calendar {
  height: 650px;
}
```

### Month view event density

```js
monthGridOptions: { nEventsPerDay: 4 }
```

---

## 🐞 Troubleshooting

### Calendar doesn't render  
Check console:

- `window.SXCalendar not available` → Schedule‑X CDN didn’t load  
- `WidgetServiceSDK not available` → check CC script URL  
- Connector errors → verify permalink & permissions  

### Events only show in Month view  
Ensure connector timestamps include **time**, e.g.:

- Correct: `2025‑11‑06T01:00:00‑07:00`
- Incorrect: `2025‑11‑06`

### Clicks don’t open the right event  
Check the console log:

```
[GS CAL] onEventClick resolved URL: https://<domain>/events/<id>
```

If the ID mapping changes in your connector, update the click handler.

---

## 📁 Files Included

| File | Purpose |
|------|---------|
| `calendar-brand-widget.html` | Calendar themed using **brand color** |
| `calendar-cta-widget.html`   | Calendar themed using **CTA button color** |
| `README.md`                  | Instructions & documentation |

---

## 🧭 Roadmap (Future Options)

- GitHub-hosted JS bundles (if CC allows full external JS execution reliably)  
- Automatic sync with event filters on CC Events pages  
- Optional dark‑mode or high‑contrast variants  

For now, copy‑and‑paste widgets provide the most stable experience inside CC.

---

If you need refinements (animation, better date picker styling, stronger brand alignment, etc.) just ask!
