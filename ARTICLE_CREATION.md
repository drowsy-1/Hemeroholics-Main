  │ Variable │                                   Value                                   │
  ├──────────┼───────────────────────────────────────────────────────────────────────────┤
  │ API_KEY  │ Any random secret string (e.g. run openssl rand -hex 32 in your terminal) │
  └──────────┴───────────────────────────────────────────────────────────────────────────┘

  To create articles, you'll now need to include the key:
  curl -X POST https://hemeroholics-main-production.up.railway.app/api/articles \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your-secret-key" \
    -d '{"title":"My First Post","slug":"my-first-post","content":"<p>Hello
  world</p>","tag":"Breeding","read_time":"5 min read","is_published":true}'
