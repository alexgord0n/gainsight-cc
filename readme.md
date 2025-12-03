# Preventing Your Gainsight Customer Community From Being Indexed

This repository contains the configuration needed to block search engines from indexing your Gainsight Customer Community.

## 1. Update `robots.txt`

Add the following rules to fully disallow all crawlers:

```
User-agent: *
Disallow: /
```

## 2. Add Meta Tag to Your `<head>`

Insert this snippet anywhere inside your Third-Party Scripts `Insert in <HEAD>` section:

```
<meta name="robots" content="noindex, nofollow">
```

These two steps together ensure your community pages are not indexed by search engines.

## 3. Speed Up Removal Using Google Search Console

To have your community removed from Google search results more quickly, use the **Google Search Console Removals Tool**:

1. Go to **Google Search Console** for the domain your community uses.
2. Navigate to **Index → Removals**.
3. Choose **New Request**.
4. Select **Temporary removal**.
5. Enter the path (e.g., `/`) to request removal of all community pages.
6. Submit the request.

This accelerates deindexing while your `robots.txt` and meta tags prevent future indexing.
