# extract-pdf (Supabase Edge Function)

This function receives page text extracted from a PDF in the admin UI and uses
OpenAI or Gemini to map the content into the ingestion schema tables.

## Environment variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (required if provider=`openai`)
- `GEMINI_API_KEY` (required if provider=`gemini`)

## Deploy

```bash
supabase functions deploy extract-pdf
```

## Set secrets

```bash
supabase secrets set OPENAI_API_KEY=... GEMINI_API_KEY=...
```

## Request payload

```json
{
  "source_id": "uuid",
  "job_id": "uuid",
  "provider": "openai",
  "model": "gpt-4.1-mini",
  "pages": [{ "page_number": 1, "text": "..." }]
}
```

## Admin UI usage notes

- The admin page now stores Supabase URL + anon key once in browser localStorage.
- For one-time source onboarding, use the **Bulk Source Seed** section in `admin/index.html`
  and paste CSV lines (`"Title","URL"`) to insert `document_sources` and queue jobs.
