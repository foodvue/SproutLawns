# SERVICE PAGE STAMPING GUIDE

## Template File
`/lawn-mowing/index.html` is the master template.

## What Changes Per Page

### 1. `<head>` Section
- `<title>` — Service name + location keywords
- `<meta name="description">` — Unique 155-char description
- `<meta name="keywords">` — Service-specific keywords × cities
- `<link rel="canonical">` — Page URL
- OG tags (title, description, image, url)
- Twitter card tags
- Service Schema JSON-LD (service name, description, offers)
- FAQ Schema JSON-LD (unique questions per service)

### 2. Nav Active State
- Change `dropdown__link--active` class to the current page's link

### 3. Interior Hero
- Banner image: `/images/{service}-banner.webp` (1920×1080)
- Alt text for banner image
- Breadcrumb: Home > Services > {Service Name}
- `<h1>` — Service name
- `.hero__subtitle` — Unique service description
- **CTA button text:**
  - 3 DeepLawn services → "Get Instant Pricing" → `/instant-estimate/`
  - 20 Jobber services → "Request a Free Estimate" → `/contact/` or Jobber form

### 4. Content Rows (2-3 per page)
- Each gets unique:
  - `.content-row__label` (e.g., "What's Included", "The Process", "Why Sprout")
  - `<h2>` heading
  - Body copy (2-3 paragraphs, genuinely unique)
  - Checklist items (if applicable)
  - Image: `/images/{service}-{descriptor}_768.webp`
  - Alt text
- Alternate: row 1 normal, row 2 reversed + light bg, row 3 normal

### 5. Inline CTA Banner
- Headline referencing the specific service
- Description copy
- **CTA:**
  - DeepLawn services → "Get Instant Pricing"
  - Jobber services → "Request a Free Estimate"

### 6. FAQ Section
- 4-6 unique questions per service
- Questions should target real search queries:
  - "How much does {service} cost in {city}?"
  - "What's included in your {service}?"
  - "When is the best time for {service} in Indiana?"
  - "What areas do you serve for {service}?"
- Answers include internal links to location pages
- FAQ Schema must match the HTML questions exactly

### 7. Related Services
- 3 complementary services (different per page)
- Card image, title, description, link

### 8. Areas Served Links
- Same 7 cities on every service page
- `<span>` text changes: "{Service Name} →" per page

### 9. Related Blog Posts
- 3 relevant blog posts (once blog is migrated)
- Placeholder images/links until then

### 10. Final CTA
- Headline: "Get a Free {Service Name} Quote"
- CTA matches DeepLawn vs Jobber strategy

---

## 3 DEEPLAWN SERVICES (satellite-measurable)
These use "Get Instant Pricing" → `/instant-estimate/`

| Page | URL |
|------|-----|
| Lawn Mowing | /lawn-mowing/ |
| Aeration & Seeding | /aeration-seeding/ |
| Fertilization & Weed Control | /fertilization-weed-control/ |

## 20 JOBBER SERVICES
These use "Request a Free Estimate" → Jobber form or /contact/

| # | Page | URL |
|---|------|-----|
| 1 | Lawn Care | /lawn-care/ |
| 2 | Landscaping Services | /landscaping-services/ |
| 3 | Landscape Trimming & Pruning | /landscape-trimming-pruning/ |
| 4 | Plantings & Bed Renovations | /plantings-and-landscape-bed-renovations/ |
| 5 | Paver Patios & Driveways | /paver-patios-driveways/ |
| 6 | Mulch & Rock | /mulch-rock/ |
| 7 | Mosquito Control | /mosquito-control/ |
| 8 | Chinch Bug Control | /chinch-bug-control/ |
| 9 | Lawn Maintenance | /lawn-maintenance/ |
| 10 | Yard Cleanups | /yard-cleanups/ |
| 11 | Spring Cleanups | /spring-cleanups/ |
| 12 | Fall Cleanups | /fall-cleanups/ |
| 13 | Leaf Removal | /leaf-removal/ |
| 14 | Snow Removal | /snow-removal/ |
| 15 | Commercial Grounds Maintenance | /commercial-grounds-maintenance/ |
| 16 | Annual Flowers & Seasonal Color | /annual-flowers-seasonal-color/ |
| 17 | Flea & Tick Control | /flea-tick-control/ |
| 18 | Landscape Bed Weed Control | /landscape-bed-weed-control/ |
| 19 | New Lawn Seeding | /new-lawn-seeding/ |
| 20 | Sod Installation | /sod-installation/ |
| 21 | Lawn Disease Control | /lawn-disease-control/ |

---

## JOBBER SERVICE CTA VARIANT
For Jobber pages, replace the hero and inline CTA like this:

**Hero actions:**
```html
<div class="hero__actions">
    <a href="/contact/" class="btn btn--pink btn--lg">Request a Free Estimate</a>
    <a href="tel:317-900-7151" class="btn btn--outline-white btn--lg">Call (317) 900-7151</a>
</div>
```

**Inline CTA banner:**
```html
<section class="cta-banner cta-banner--inline" data-animate>
    <div class="container cta-banner__inner">
        <div class="cta-banner__text">
            <h2>Get a Free {Service} Estimate</h2>
            <p>Tell us about your property and we'll get back to you with a quote — usually within 24 hours.</p>
        </div>
        <div class="cta-banner__actions">
            <a href="/contact/" class="btn btn--pink btn--lg">Request a Free Estimate</a>
            <a href="tel:317-900-7151" class="btn btn--outline-white btn--lg">Call (317) 900-7151</a>
        </div>
    </div>
</section>
```

**Final CTA:**
```html
<h2>Get a Free {Service Name} Quote</h2>
<p>Tell us about your project and we'll get back to you with pricing — usually same day.</p>
<div class="cta-section__actions">
    <a href="/contact/" class="btn btn--pink btn--lg">Request a Free Estimate</a>
    <a href="tel:317-900-7151" class="btn btn--outline btn--lg">Call (317) 900-7151</a>
</div>
```
