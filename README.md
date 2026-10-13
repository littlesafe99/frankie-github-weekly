# Frankie GitHub Weekly

Collects the top ten from GitHub Trending's weekly page, preserving GitHub rank, total stars and stars gained this week. No AI model or GPT API is called.

Runs Monday at 09:00 Asia/Taipei (01:00 UTC), with a second attempt at 09:20. GitHub may delay scheduled jobs. Every capture uses its actual Taipei date and UTC timestamp. Existing weeks are immutable. Only a complete, validated ten-entry list is committed. The public `data/snapshots.json` feed is read by Frankie's website. September 2026 records retain their immutable community archive source links and historical star counts.

The workflow uses GitHub's built-in temporary repository token to commit public data. No website credentials, personal data or paid AI keys are stored here. It commits a new snapshot weekly, keeping the repository active.
