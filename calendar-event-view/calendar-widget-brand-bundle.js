// calendar-widget-brand-bundle.js
// Brand-based Schedule-X calendar bundle for CC
(function () {
  console.log('[GS CAL] brand bundle loaded');

  // ---- Inject CSS theme + layout ----
  function injectStyles() {
    if (document.getElementById('gs-calendar-theme-brand')) return;

    const css = `
      .calendar-wrapper {
        max-width: 1200px;
        margin: 0 auto;
      }

      #gs-calendar {
        height: 650px;
        max-width: 100%;
        overflow: hidden;

        /* === Schedule-X theme overrides (bind to CC brand) === */

        /* Main accent color (navigation, focus, selected view, etc.) */
        --sx-color-primary: var(--config--main-color-brand);
        --sx-color-on-primary: #ffffff;

        /* Selected / active surfaces (view dropdown active, date picker selection) */
        --sx-color-primary-container: color-mix(
          in srgb,
          var(--config--main-color-brand) 15%,
          var(--config-body-background-color) 85%
        );
        --sx-color-on-primary-container: var(--config--main-color-night-light, #2b2b2b);

        /* Generic surfaces */
        --sx-color-surface: var(--config-body-background-color);
        --sx-color-surface-container: var(--config-body-background-color);
        --sx-color-surface-container-low: var(--config-body-background-color);

        /* Outlines/borders (e.g. date picker border) */
        --sx-color-outline: var(--config--main-border-base-color);
        --sx-color-outline-variant: var(--config--main-border-base-color);

        /* Hover “dim” surfaces (chevrons, date-picker hover, etc.) */
        --sx-color-surface-dim: color-mix(
          in srgb,
          var(--config--main-color-brand) 10%,
          var(--config-body-background-color) 90%
        );

        /* Ripple / subtle gray background */
        --sx-internal-color-gray-ripple-background: var(--config--main-color-day);
      }

      /* Let the Schedule-X calendar stretch to fill our container height */
      #gs-calendar .sx__calendar {
        height: 100%;
      }

      #gs-calendar .sx__time-grid,
      #gs-calendar .sx__grid {
        height: 100%;
      }

      /* Keep text tidy but don't override the font family coming from CC */
      #gs-calendar * {
        font-size: 14px;
      }

      /* Normalize any rotated nav labels inside the calendar */
      #gs-calendar [style*="rotate("] {
        transform: none !important;
        writing-mode: horizontal-tb !important;
      }

      /* Hide the "Previous period / Next period" text but keep the chevron glyph */
      #gs-calendar .sx__chevron {
        font-size: 0 !important;
        line-height: 1;
      }

      /* Make events clearly clickable instead of text-selectable */
      #gs-calendar .sx__event,
      #gs-calendar .sx__event * {
        cursor: pointer;
      }

      /* Fix top border clipping on the Date label */
      label.sx__date-input-label {
        width: fit-content;
      }

      /* Ensure the date input uses our outline color on focus */
      #gs-calendar input.sx__date-input:focus {
        border-color: var(--sx-color-outline) !important;
      }
    `;

    const style = document.createElement('style');
    style.id = 'gs-calendar-theme-brand';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---- Ensure wrapper exists (if you ever want .calendar-wrapper) ----
  function ensureWrapper() {
    let wrapper = document.querySelector('.calendar-wrapper');
    let cal = document.getElementById('gs-calendar');

    if (!cal) {
      cal = document.createElement('div');
      cal.id = 'gs-calendar';
    }

    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'calendar-wrapper';
      wrapper.appendChild(cal);
      const target = document.currentScript
        ? document.currentScript.parentElement
        : document.body;
      target.insertBefore(wrapper, document.currentScript);
    } else if (!wrapper.contains(cal)) {
      wrapper.appendChild(cal);
    }
  }

  // ---- Date formatting ----
  function formatForScheduleX(isoString) {
    if (!isoString) return null;
    const withoutT = isoString.replace('T', ' ');
    return withoutT.slice(0, 16);
  }

  // ---- Fetch events from CC ----
  async function fetchCommunityEvents() {
    if (!window.WidgetServiceSDK) {
      console.error('[GS CAL] WidgetServiceSDK not available');
      return [];
    }

    const sdk = new window.WidgetServiceSDK();

    try {
      const result = await sdk.connectors.execute({
        permalink: 'get-calendar-events',
        method: 'GET'
      });

      console.log('[GS CAL] Raw connector result:', result);

      const eventsArray = result.result || [];

      const mapped = eventsArray.map((evt, index) => {
        const start = formatForScheduleX(evt.startDate);
        const end   = formatForScheduleX(evt.endDate);

        return {
          id: String(evt.id || index),
          title: evt.title || 'Event',
          start: start || (evt.startDate ? evt.startDate.slice(0, 10) : null),
          end:   end   || (evt.endDate   ? evt.endDate.slice(0, 10)   : null),
          meta: {
            url: evt.url || evt.externalRegistrationUrl || null
          }
        };
      });

      console.log('[GS CAL] Final mapped events:', mapped);
      return mapped;
    } catch (err) {
      console.error('[GS CAL] Error calling get-calendar-events connector', err);
      return [];
    }
  }

  // ---- Init Schedule-X calendar ----
  async function initCalendar() {
    console.log('[GS CAL] initCalendar (brand)');

    if (!window.SXCalendar) {
      console.error('[GS CAL] window.SXCalendar is not available');
      return;
    }

    ensureWrapper();
    injectStyles();

    var calendarEl = document.getElementById('gs-calendar');
    if (!calendarEl) {
      console.error('[GS CAL] #gs-calendar not found after ensureWrapper');
      return;
    }

    var SX             = window.SXCalendar;
    var createCalendar = SX.createCalendar;

    var viewMonthGrid = SX.viewMonthGrid;
    var viewWeek      = SX.viewWeek || null;
    var viewDay       = SX.viewDay  || null;

    var views = [];
    if (viewMonthGrid) views.push(viewMonthGrid);
    if (viewWeek)      views.push(viewWeek);
    if (viewDay)       views.push(viewDay);

    if (!views.length) {
      console.error('[GS CAL] No views available on SXCalendar');
      return;
    }

    var defaultViewName =
      (viewWeek && viewWeek.name) ||
      (viewMonthGrid && viewMonthGrid.name) ||
      views[0].name;

    var events = await fetchCommunityEvents();

    var calendar = createCalendar({
      views: views,
      defaultView: defaultViewName,
      events: events,
      isResponsive: true,
      weekOptions: {
        gridHeight: 900
      },
      monthGridOptions: {
        nEventsPerDay: 4
      },
      callbacks: {
        onEventClick: function (payload) {
          var evt = payload && (payload.calendarEvent || payload.event || payload);
          var id  = evt && (evt.id || (evt.meta && evt.meta.id));

          if (!id) {
            console.warn('[GS CAL] onEventClick: no id found in payload', payload);
            return;
          }

          var baseUrl = window.location.origin;
          var url     = baseUrl + '/events/' + id;

          console.log('[GS CAL] onEventClick resolved URL:', url, payload);
          window.location.href = url;
        }
      }
    });

    calendar.render(calendarEl);

    console.log(
      '[GS CAL] calendar rendered (brand) with views:',
      views,
      'events:',
      events.length,
      'defaultView:',
      defaultViewName
    );
  }

  function scheduleInit() {
    setTimeout(initCalendar, 800);
  }

  if (document.readyState === 'complete') {
    scheduleInit();
  } else {
    window.addEventListener('load', scheduleInit);
  }
})();
