# Gainsight CC – Schedule-X Calendar Event View

This folder contains **copy‑paste HTML widgets** for embedding a modern Schedule‑X calendar inside a **Gainsight Customer Community (CC)** HTML widget.

Two widget variants are provided:

- **`calendar-brand-widget.html`** — Calendar colors follow your **brand color** (`--config--main-color-brand`)
- **`calendar-cta-widget.html`** — Calendar colors follow your **CTA button color** (`--config-button-cta-background-color`)

These widgets:

- Render **Month / Week / Day** views using Schedule‑X  
- Load events via **Gainsight CC Secure API Connectors**  
- Map timestamps into proper timed events  
- Match CC’s styling using CSS variables  
- Open events using `/events/{id}` in the same tab  

No external JS hosting is required — copy and paste the widget’s HTML into CC.

---

# 🚀 How to Use

## 1) Choose Your Theme Variant

Pick one of the widget files:

| File | Description |
|------|-------------|
| `calendar-brand-widget.html` | Calendar themed using **brand color** |
| `calendar-cta-widget.html`   | Calendar themed using **CTA button color** |

You can swap variants at any time by replacing the widget code.

---

# 🔧 Required Setup (Back-end Admin Steps)

Before the calendar widget can load events, you **must** configure:

1. A **CC API Key**
2. A **Secure API Connector**
3. CC **Secrets** for client_id / client_secret

Follow these steps exactly.

---

# ✅ Step 1 — Create an API Key in Gainsight CC

1. Go to **Control → Integrations → API Keys**  
2. Create a new API key  
3. Copy the:
   - **Client ID**
   - **Client Secret**

You’ll use these in Steps 3 and 4.

---

# ✅ Step 2 — Add the Secure API Connector

1. Go to **Control → Integrations → Connectors (Secure)**  
2. Click **Add Connector** → choose **HTTPS**  
3. Configure:

```
Name: Calendar Events
Permalink: get-calendar-events
Method: GET
Base URL: https://<your-community-domain>/api/v2/
```

4. Set request path, e.g.:

```
events?sort=upcoming&limit=100
```

5. Under **Authentication**, choose:  
   **API Key (client_credentials)**

6. Save the connector.

---

# ✅ Step 3 — Create CC Secrets

Go to **Control → Settings → Secrets** and create two secrets:

### **A. CALENDAR_CLIENT_ID**
```
<your Client ID>
```

### **B. CALENDAR_CLIENT_SECRET**
```
<your Client Secret>
```

---

# ✅ Step 4 — Connect Secrets to the Connector

Edit the `get-calendar-events` connector:

| Connector Field | CC Secret |
|-----------------|-----------|
| `client_id`     | `{{ secret:CALENDAR_CLIENT_ID }}` |
| `client_secret` | `{{ secret:CALENDAR_CLIENT_SECRET }}` |

Save.

Your connector now authenticates securely using CC’s internal secret system.

---

# 🧪 Step 5 — Test Your Connector

Click **Test Request** inside the connector.

You should see:

```json
{
  "result": [
    {
      "id": "6",
      "title": "Example Event",
      "startDate": "2025-11-06T01:00:00-07:00",
      "endDate": "2025-11-06T02:00:00-07:00",
      "url": "/events/6"
    }
  ],
  "_metadata": {
    "totalCount": 1
  }
}
```

If you see event data, you’re ready for the widget installation.

---

# 🧩 Step 6 — Install the Calendar Widget

1. Open the CC page where you want the calendar  
2. Add an **HTML widget**  
3. Open one of the widget files:
   - `calendar-brand-widget.html`
   - `calendar-cta-widget.html`
4. Click **Raw** on GitHub  
5. Copy **everything**  
6. Paste into the HTML widget  
7. Save & publish  

The calendar should now render in Month, Week, and Day views with real community events.

---

# 🎨 Theming (Brand vs CTA)

Both widgets override Schedule‑X's CSS variables:

### Brand Variant
- Primary accent: `--config--main-color-brand`
- Best if your community uses brand color for navigation and accents

### CTA Variant
- Primary accent: `--config-button-cta-background-color`
- Best if your community uses CTA buttons as the main visual anchor

Both will automatically update if your CC theme colors change.

---

# 🛠 Optional Tweaks

### Default view
Change:

```js
var defaultViewName =
  (viewWeek && viewWeek.name) ||
  (viewMonthGrid && viewMonthGrid.name) ||
  views[0].name;
```

To force Month:

```js
var defaultViewName = 'month-grid';
```

### Calendar height
```css
#gs-calendar {
  height: 650px;
}
```

### Events per day (Month view)
```js
monthGridOptions: { nEventsPerDay: 4 }
```

---

# 🐞 Troubleshooting

### Calendar does not render
Check DevTools console for:
- `window.SXCalendar not available`
- `WidgetServiceSDK not available`
- Connector errors (permalink, secrets, API base URL)

### Events only show in Month view
Connector timestamps **must include time**, e.g.:

- Correct: `2025-11-06T01:00:00-07:00`
- Incorrect: `2025-11-06`

### Click does not open event  
Check console:

```
[GS CAL] onEventClick resolved URL: https://<domain>/events/<id>
```

If payload changes, adjust the click handler accordingly.

---

# 📁 Files in This Folder

| File | Description |
|------|-------------|
| `calendar-brand-widget.html` | Calendar themed with **brand color** |
| `calendar-cta-widget.html`   | Calendar themed with **CTA color** |
| `README.md`                  | This documentation |

---

# 🧭 Roadmap (Future Enhancements)

- Sync CC event filters with calendar  
- Optionally host widget JS/CSS via GitHub Pages  
- Dark mode version  
- Multi-calendar support  

If you want help extending the widget, improving UX, or supporting more CC theming, just ask!
