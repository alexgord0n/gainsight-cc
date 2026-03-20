# Community Product Switcher

A drop-in navigation header for Gainsight Customer Community (formerly inSided) that lets users switch between multiple product sub-communities from a single header. Includes a logo-based dropdown switcher, a full top navigation bar with multi-level dropdowns, role-gating, dark mode support, and a responsive mobile slide-out panel.

---

## What It Does

- Displays a logo in the top-left that opens a dropdown to switch between communities
- Renders a full navigation bar with submenus and nested subdropdowns
- Remembers the selected community across page loads via `localStorage`
- Auto-detects the correct community based on the current URL path
- Hides nav items from users who don't have the required role
- Switches between light/dark logo variants based on the platform dark mode class
- All colors and shadows use Gainsight CSS variables — no hardcoded values

---

## Files

| File | Purpose |
|---|---|
| `product-switcher.html` | The full component: CSS, mount point div, and JavaScript |

When deploying to Gainsight, you will paste the CSS into the **Custom CSS** field and the JavaScript into the **Custom Header HTML** field. See the deployment section below.

---

## Configuration

All configuration lives at the top of the `<script>` block in four clearly marked sections. You do not need to touch the builder functions below them.

### Section 1 — PRODUCTS

Defines the communities that appear in the logo dropdown.

```js
const PRODUCTS = [
  {
    key: 'product-a',            // unique ID, used internally and in localStorage
    label: 'Product A Community', // display text in the dropdown
    url: 'https://your-community.example.com/',  // where to navigate on click
    logo: {
      src:     'https://example.com/logo-light.png', // light mode logo URL
      srcDark: 'https://example.com/logo-dark.png',  // dark mode logo URL
      alt:     'Product A'                           // alt text
    }
  },
  // add more products...
];
```

**Tips:**
- Upload logo images to Gainsight via Settings > Attachments, then use the resulting CDN URL
- If you only have one logo (no dark variant), set `srcDark` to the same URL as `src`
- The first product in the array is the fallback if no match is found

---

### Section 2 — NAV_CONFIGS

Defines the top navigation links for each product. The key must match a `PRODUCTS[].key`.

```js
const NAV_CONFIGS = {
  'product-a': [
    {
      text: 'Discussions',
      href: '/discussions',
      submenu: [                         // optional first-level dropdown
        { text: 'General', href: '/general' },
        {
          text: 'Guides',
          href: '/guides',
          submenu: [                     // optional second-level dropdown
            { text: 'Getting started', href: '/getting-started' },
            { text: 'Best practices',  href: '/best-practices'  }
          ]
        }
      ]
    },
    {
      text: 'Members Only',
      href: '/members-area',
      roles: ['Member', 'VIP']          // hidden unless user has one of these roles
    },
    { text: 'Events', href: '/events' } // top-level link with no dropdown
  ]
};
```

**Nesting rules:**
- Top-level items show in the header bar
- Each item can have a `submenu` array (first-level dropdown)
- Each submenu item can have its own `submenu` array (second-level flyout)
- Third-level nesting is not supported

**Role-gating:**
- Add `roles: ['Role Name']` to any item to hide it from users without that role
- Platform admin roles (`roles.super-admin`, `roles.community-manager`, etc.) always bypass role checks
- If `roles` is omitted, the item is visible to everyone

---

### Section 3 — URL_MAP

Maps URL pathnames to product keys so the correct community is activated on page load, regardless of what is stored in `localStorage`.

```js
const URL_MAP = {
  '/':               'product-a', // homepage = Product A
  '/p/product-b':    'product-b', // custom page = Product B
  '/p/product-c':    'product-c'
};
```

Add one entry for each community's landing page. Use exact pathname strings (no domain, no trailing slash unless it is the root `/`).

---

### Section 4 — ADMIN_ROLES

Role strings that grant full visibility to all role-gated nav items. These match the internal role keys Gainsight assigns to community managers and admins.

```js
const ADMIN_ROLES = [
  'roles.super-admin',
  'roles.community-manager',
  'roles.administrator',
  'roles.super-user'
];
```

You generally do not need to change this unless your community uses custom admin role names.

---

## Styling and CSS Variables

All colors, shadows, and backgrounds reference Gainsight CSS variables. No hex values or hardcoded colors are used. The fallback values (after the comma inside `var()`) are safe defaults for local preview only.

| CSS Variable | Used For |
|---|---|
| `--config-main-navigation-background-color` | Header, dropdown, and mobile panel backgrounds |
| `--config-main-navigation-nav-color` | Link text, chevron fill, hamburger lines |
| `--config-main-navigation-nav-link-color` | Mobile top-level link text |
| `--config-card-border-color` | Dropdown border |
| `--config-widget-box-shadow` | Dropdown and mobile panel shadow |
| `--config-meta-text-color` | Second-level chevron icons, deepest link color |
| `--config--main-color-night-light` | Dark mode dropdown and panel background |
| `--config--main-button-base-font-color` | Dark mode deep submenu link text |

These variables are set automatically by the Gainsight theme engine based on your community's color configuration. No manual CSS overrides are needed.

---

## Deployment to Gainsight Customer Community

### Step 1 — Add the CSS

1. In the Gainsight admin panel, go to **Customization > Custom CSS**
2. Copy everything inside the `<style>...</style>` tags from `product-switcher.html`
3. Paste it into the Custom CSS field
4. Save

### Step 2 — Add the HTML and JavaScript

1. Go to **Customization > Custom Header**
2. In the HTML section, add the mount point div:

```html
<div id="ps-container"></div>
```

3. Copy everything inside the `<script>...</script>` tags (the IIFE block) from `product-switcher.html`
4. Wrap it in `<script>` tags and paste it below the div in the same Custom Header field
5. Save

### Step 3 — Update the configuration

Before saving, update the three config sections in the script to match your actual communities:

- Replace placeholder `PRODUCTS` entries with your real community names, URLs, and logo image URLs
- Replace placeholder `NAV_CONFIGS` entries with your actual navigation structure and hrefs
- Update `URL_MAP` to match your community's URL paths

### Step 4 — Upload logos

1. Go to **Settings > Attachments** (or your community's media library)
2. Upload your light and dark mode logo files
3. Copy the CDN URLs and paste them into the `logo.src` and `logo.srcDark` fields in `PRODUCTS`

---

## Dark Mode

The component reads the `dark-mode-enabled` class on the `<body>` element, which Gainsight adds automatically when a user has dark mode active. No additional configuration is needed. Ensure you provide a `srcDark` logo URL for each product so logos remain legible in dark mode.

---

## Mobile Behavior

- The navigation bar is hidden below 1140px wide
- A hamburger button appears in the top-left
- Tapping it opens a slide-in panel from the left
- Submenus expand/collapse via chevron buttons inside the panel
- Tapping any link or the overlay closes the panel

---

## How Product Selection Works

1. On page load, the script checks `URL_MAP` for the current pathname
2. If no URL match, it reads `localStorage.getItem('selectedProduct')`
3. If nothing is stored, it falls back to the first product in `PRODUCTS`
4. The selected key is written back to `localStorage` so it persists across navigation

When a user picks a community from the logo dropdown, the new key is saved to `localStorage` before redirecting — so the correct community header renders immediately on the destination page.

---

## Local Preview

Open `product-switcher.html` directly in a browser to preview layout and styling. Because `inSidedData` is not available outside the platform, the script falls back to treating the visitor as a logged-out guest — all role-gated items will be hidden. This is expected behavior.

To test role-gated items locally, temporarily add a shim before the `IIFE`:

```html
<script>
  var inSidedData = { user: { role: 'Member,VIP' } };
</script>
```

Remove this shim before deploying.
