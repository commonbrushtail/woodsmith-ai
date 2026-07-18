# Production Caddy config for the WoodSmith deployment.
# Single domain, path-routed + automatic HTTPS:
#   - Supabase API paths  -> kong:8000  (auth/rest/storage/etc.)
#   - everything else      -> app:3000  (the Next.js app; homepage, /products,
#                                         /auth/callback/line, /api/*, admin, ...)
# The app's NEXT_PUBLIC_SUPABASE_URL is baked as https://{PROXY_DOMAIN}, so
# supabase-js calls hit /rest/v1|/auth/v1|/storage/v1 on this same domain and
# Caddy forwards them to Kong. App auth routes (/auth/callback/*) do NOT match
# the /auth/v1/* prefix, so they correctly reach the app.
{$PROXY_DOMAIN} {
    @supabase_api path /auth/v1/* /rest/v1/* /storage/v1/* /realtime/v1/* /functions/v1/* /graphql/v1

    handle @supabase_api {
        reverse_proxy kong:8000
    }

    handle {
        reverse_proxy app:3000
    }

    encode gzip zstd
    header -server
}
