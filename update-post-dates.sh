#!/bin/bash
# Run from the repo root. Updates dates in blog post files.
# Usage: bash update-post-dates.sh

declare -A DATES
# Batch 5 posts
DATES[why-your-new-sod-is-turning-brown]="2026-03-28|March 28, 2026"
DATES[why-mowing-patterns-matter-more-than-you-think]="2026-03-24|March 24, 2026"
DATES[how-to-get-your-yard-ready-for-a-cookout-or-party]="2026-03-19|March 19, 2026"
DATES[the-real-cost-of-skipping-lawn-care-for-a-season]="2026-03-14|March 14, 2026"
DATES[do-you-really-need-a-fall-cleanup]="2026-03-10|March 10, 2026"
# Batch 10 posts
DATES[why-fresh-mulch-every-spring-is-worth-the-investment]="2026-03-05|March 5, 2026"
DATES[why-your-sprinkler-system-might-be-hurting-your-lawn]="2026-02-28|February 28, 2026"
DATES[what-to-do-with-your-lawn-during-a-drought-in-indiana]="2026-02-24|February 24, 2026"
DATES[how-to-repair-a-lawn-after-construction-damage]="2026-02-19|February 19, 2026"
DATES[how-shade-changes-what-your-lawn-needs]="2026-02-14|February 14, 2026"
DATES[how-long-does-it-take-to-see-results-from-lawn-care]="2026-02-10|February 10, 2026"
DATES[how-to-tell-when-your-shrubs-need-replacing]="2026-02-05|February 5, 2026"
DATES[why-diy-weed-killer-from-the-hardware-store-often-backfires]="2026-01-30|January 30, 2026"
DATES[what-hoa-boards-should-know-about-grounds-maintenance]="2026-01-24|January 24, 2026"
DATES[the-difference-between-dethatching-and-aeration]="2026-01-18|January 18, 2026"

for slug in "${!DATES[@]}"; do
  f="blog/$slug/index.html"
  if [ ! -f "$f" ]; then echo "SKIP: $f not found"; continue; fi
  
  IFS='|' read -r iso_date display_date <<< "${DATES[$slug]}"
  
  # Replace ISO date in meta tag and schema
  sed -i "s/2026-04-01/$iso_date/g" "$f"
  
  # Replace visible date line
  sed -i "s/April 1, 2026/$display_date/g" "$f"
  
  echo "OK: $slug -> $display_date"
done
