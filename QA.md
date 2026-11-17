# Asante Used Auto Parts Prototype

## Scope

- React, TypeScript, Tailwind CSS v4, and Vite front end.
- No backend, authentication, payment collection, live inventory API, or message delivery.
- Personal information stays in component state. Closing a form, leaving its page, or refreshing can clear it.
- Prices, vehicle matches, and product references are explicitly sample information.
- Locally stored AI-generated automotive imagery is illustrative, not verified inventory photography.
- The service map uses bundled US state geometry and highlights only Maryland, Virginia, New York, New Jersey, and Delaware.

## Verification Status

- Production build: passed using the provided build tool.
- Type diagnostics: checked by the editing tools; reported issues resolved.
- Source review: navigation destinations, sample matching logic, sorting, prefill propagation, validation, modal focus handling, reset behavior, and local-only confirmations reviewed.
- Live browser interaction, screenshot, screen-reader, and physical-device testing: not executed because this environment does not provide a browser test tool.

## Browser QA Checklist

The following is a reproducible acceptance checklist, not a record of browser tests already executed.

### Navigation

1. Open the homepage, `#/engines`, `#/transmissions`, and `#/contact` directly.
2. Follow every header and footer link. Verify Home returns to the hero and section links clear the sticky header.
3. Verify browser back/forward, repeated section-link activation, and the unknown-route recovery link.
4. At 320px, 375px, 768px, 1024px, and 1440px, verify there is no horizontal overflow.
5. Open and close the mobile menu using the toggle, scrim, Escape, and a menu selection. Verify body scrolling resumes.
6. Verify both phone numbers use the appropriate `tel:` URLs throughout the site.

### Vehicle Finder

1. Submit with no selections. Expect friendly year, make, model, and category errors and focus on year.
2. Search 2015 / Toyota / Camry / Engine. Expect one demonstration listing, not a guaranteed-fit claim.
3. Add `2.5L` to that search. Expect the same listing.
4. Change the part to Transmission. Expect the empty state and a prefilled Request This Part action.
5. Search 2014 / Kia / Optima / Transmission. Expect the sample automatic transmission.
6. Select Ford / Fusion / 2020, then change to 2026. Expect the now-invalid model selection to clear.
7. Enter a malformed optional ZIP code. Expect an inline error and no search.
8. Reset during the short loading state. Expect the timer, criteria, errors, and results to clear.
9. Request a matching part directly and through its detail dialog. Verify year, make, model, category, ZIP, sample reference, and applicable details carry through.

### Inventory

1. Switch All Parts, Engines, and Transmissions. Expect six, four, and two sample cards respectively before other filters.
2. Sort all samples by ascending price. Expect $650, $950, $1,050, $1,100, $1,150, $1,450.
3. Reverse the price sort, then sort by category.
4. Select every brand tile. Expect matching examples or a helpful empty state; no real availability claims.
5. On both category pages, combine make, year, model, and optional configuration filters. Reset them.
6. Open each product detail dialog, close it, and open another.

### Forms And Dialogs

1. In a dialog, use Tab and Shift+Tab repeatedly. Focus should remain inside. Escape, close, and backdrop actions should work and restore focus.
2. Submit each empty inquiry form. Expect linked field errors and no outgoing request.
3. In the part form, test malformed phone, email, ZIP, and optional VIN values.
4. Select Email as the preferred contact method. Email should become required.
5. Change make or year after selecting a model. Invalid model choices should clear.
6. Submit a valid part request. Expect a visible local-only success screen and a summary of all supplied details.
7. Select Request Another Part. Expect a cleared form and focus on the first field.
8. Open a delivery inquiry. Try a past date, then valid delivery and pickup requests. Expect no real booking and a summary.
9. Submit a valid general inquiry. Expect a prepared-not-sent confirmation and a working reset.
10. Confirm no form asks for payment details, requires a VIN to browse, or claims a real message was sent.

### Accessibility And Resilience

1. Navigate all controls using only a keyboard, including FAQ questions, trust explanations, filters, and forms.
2. Open and close each FAQ. Verify the matching answer and expanded state.
3. Enable reduced motion. Verify entrance, hover, loading, and accordion motion is reduced without hiding content.
4. Block an image request. Expect descriptive fallback treatment rather than a broken-image icon.
5. Review at 200% browser zoom, test real mobile keyboards, and check contrast with an accessibility audit tool.
6. Inspect the browser console during all paths and confirm no runtime errors or unintended network submissions.