# PROJECT: Sprout Lawn & Landscape Website Rebuild

## PHASE 2 SUMMARY

### WHAT'S DONE — Phase 1 Complete:
Homepage is live at https://sprout-lawns.vercel.app/ with shared CSS/JS design system. GitHub repo: sprout-lawns (private, connected to Vercel, auto-deploys on push).

**Files built and deployed:**
- `/index.html` — Homepage
- `/css/main.css` — Full design system (all pages use this)
- `/js/main.js` — All tracking codes + interactions (all pages use this)
- `/images/` — All 257 images from WordPress deployed plus `veteran-owned-badge.webp` (custom graphic)
- `/robots.txt` — Disallow all (dev mode)

### DESIGN SYSTEM LOCKED:
- Colors: Dark green `#2c4a2e`, pink accent `#d4327f`, pink light `#e84a9a`
- Fonts: Cormorant Garamond (display) + Outfit (body) from Google Fonts
- Sticky nav with dropdown menus for Services (24 pages) and Areas Served (7 cities)
- Hero sections: video variant (homepage) and image variant (interior pages)
- Trust bar: 5-star rated, veteran owned, fully insured, locally operated
- Service cards grid, content rows, FAQ accordion with schema, CTA banners
- Email signup bar above footer ("Get Seasonal Deals & Lawn Tips" — needs Mailchimp or JotForm wired up)
- Footer with grass graphic overlapping into white section above, full sitemap links
- Side tab "Get an Estimate" on every page except /instant-estimate/
- Scroll animations via IntersectionObserver
- Full responsive: desktop, tablet, mobile
- All tracking codes in main.js: both Facebook pixels (545120554910959, 304993876718773), Google Ads (AW-748853640) with phone conversion, Bing UET (15247889), WhatConverts, Hotjar (5104239), reCAPTCHA loader, DeepLawn loader

### HOMEPAGE DECISIONS:
- Hero: Veteran-owned badge (custom distressed flag graphic, 82px tall in glass pill with text), headline "Lawn & Landscape Maintenance", description lists all 7 cities, YouTube video background (ID: 5-GpCHqkZlE)
- CTAs: "Get Instant Pricing" → /instant-estimate/, "Call (317) 900-7151"
- 7 service cards: Mowing, Trimming, Mulch, Cleanups, Fertilization, Aeration, Snow Removal
- About section: "Your Neighbors, Not a National Chain" with trailer photo
- Commercial CTA banner with 1920x1080 commercial image
- Areas served grid: 7 cities
- Final CTA section
- Email signup bar
- Footer with grass overlap

### AREAS SERVED (7 cities, not 9):
Noblesville, Carmel, Westfield, Fishers, Fortville, McCordsville, Cicero
REMOVED: Nora, Meridian Hills, Zionsville (don't service those)

### INSTANT ESTIMATE STRATEGY:
- DeepLawn widget on `/instant-estimate/` page only (NOT on homepage)
- DeepLawn handles 3 satellite-measurable services: lawn mowing, aeration & overseeding, fertilization & weed control
- Jobber work request form below DeepLawn on that page for everything else
- On the 3 instant-estimate service pages, CTA says "Get Instant Pricing" → DeepLawn
- On the other 20 service pages, CTA says "Request a Free Estimate" → Jobber form
- Side tab stays generic "Get an Estimate" everywhere

### IMAGE MAP:
All 257 images are deployed to `/images/`. Master mapping JSON saved at `/home/claude/sprout-lawns/image-map.json` cross-referencing WordPress API data to actual files. Every service page, location page, and blog post has its images mapped — banner (1920x1080 hero) + content images (768px).

### WHAT'S NEXT — Phase 2:
Build the service page template, location page template, and blog post template. Then stamp out all 23 service pages, 7 location pages (with genuinely unique content per city), and utility pages (contact, about, gallery, careers, instant-estimate, privacy policy). Blog migration (64 posts) comes after.

### SERVICE PAGES (23):
Each gets: interior hero with 1920x1080 banner, breadcrumb, 2-3 content sections with images, FAQ section with schema markup, Jobber quote form (or DeepLawn link for the 3 measurable services), related blog links, internal links to location pages.

### ALL 24 SERVICE PAGE URLS:
1. /lawn-care/
2. /lawn-mowing/
3. /fertilization-weed-control/
4. /aeration-seeding/
5. /landscaping-services/
6. /landscape-trimming-pruning/
7. /plantings-and-landscape-bed-renovations/
8. /paver-patios-driveways/
9. /mulch-rock/
10. /mosquito-control/
11. /chinch-bug-control/
12. /lawn-maintenance/
13. /yard-cleanups/
14. /spring-cleanups/
15. /fall-cleanups/
16. /leaf-removal/
17. /snow-removal/
18. /commercial-grounds-maintenance/
19. /annual-flowers-seasonal-color/
20. /flea-tick-control/
21. /landscape-bed-weed-control/
22. /new-lawn-seeding/
23. /sod-installation/
24. /lawn-disease-control/

### 3 DEEPLAWN SERVICES (Get Instant Pricing CTA):
- /lawn-mowing/
- /aeration-seeding/
- /fertilization-weed-control/

### 20 JOBBER SERVICES (Request a Free Estimate CTA):
All other service pages
