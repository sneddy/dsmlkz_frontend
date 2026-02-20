# Schema Redesign (2026-02-20)

## Goal
Remove duplicated storage of the same entities and keep one canonical source per domain:

- Telegram channel/post content
- Job post details
- Telegram-to-profile mapping
- Verification state

## Canonical tables

- `public.telegram_channels`
- `public.telegram_posts`
- `public.job_posts`
- `public.job_post_contacts`
- `public.profile_telegram_links`
- `public.profile_verifications`

## Compatibility layer

Legacy names are preserved as read-only views so existing readers continue to work:

- `public.channels_content`
- `public.job_details`
- `public.telegram_links`
- `public.verified_profiles`

Legacy physical tables are renamed to:

- `*_legacy`

## Data migration behavior

- Backfills all rows from legacy tables into canonical tables.
- Deduplicates by keeping the most recent record per entity (`profile_id`, `telegram_id`, `post_id`).
- Stores skipped/ambiguous rows in `public.schema_normalization_conflicts`.

## Validation queries

```sql
-- 1) Legacy views and canonical tables should expose same post counts
select (select count(*) from public.channels_content) as channels_content_rows,
       (select count(*) from public.telegram_posts) as telegram_posts_rows;

-- 2) Job rows should be preserved
select (select count(*) from public.job_details) as job_details_rows,
       (select count(*) from public.job_posts) as job_posts_rows;

-- 3) No duplicate telegram mappings in canonical tables
select telegram_id, count(*)
from public.profile_telegram_links
group by telegram_id
having count(*) > 1;

select telegram_id, count(*)
from public.profile_verifications
group by telegram_id
having count(*) > 1;

-- 4) Check unresolved legacy rows
select entity_type, reason, count(*)
from public.schema_normalization_conflicts
group by entity_type, reason
order by entity_type, reason;
```

