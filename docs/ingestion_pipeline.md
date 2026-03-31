# Campus.gov.il PDF Ingestion Pipeline

This pipeline automates the process of importing psychometric study materials from Campus.gov.il into the platform's Supabase instance.

## Workflow Overview

The pipeline is triggered manually via GitHub Actions. It reads a CSV file containing PDF links, downloads each file, uploads it to Supabase Storage, and records the metadata in the database.

## Prerequisites

### 1. CSV Input Format
The script expects a file at `data/campus_pdf_links_clean.csv` with the following columns:
- `URL`: Direct link to the PDF.
- `Text`: Descriptive title of the content.

### 2. GitHub Secrets
Ensure the following secrets are configured in your GitHub repository:
- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for administrative access (required for storage uploads and DB inserts).
- `SUPABASE_BUCKET`: (Optional) The storage bucket name. Defaults to `source-pdfs`.

## How to Run

1. Navigate to the **Actions** tab in your GitHub repository.
2. Select the **Import Campus PDFs** workflow from the sidebar.
3. Click **Run workflow**.
4. Configure the optional parameters:
   - **Limit**: Number of PDFs to process (useful for testing, e.g., set to `3`).
   - **Dry run**: If checked, the script will simulate the process without uploading files or inserting database rows.

## Ingestion Logic

### Subject Inference
The script automatically categorizes PDFs based on keywords in their titles:
- **English**: אנגלית, english
- **Hebrew**: מילולי, חשיבה מילולית, עברית, לשון, פסקה, חיבור
- **Vocabulary**: מילים, אוצר מילים, vocabulary
- **Math**: אלגברה, גיאומטריה, בעיות, תרשימים, כמותי, מתמט
- **Simulations**: סימולציה, פתרון, תשובות (Stored under `simulations/math/`)

### Storage Structure
Files are stored in the bucket using a structured path:
`{subject}/{subject}/{filename}.pdf`

### Idempotency
- **Database**: The script skips URLs that already exist in the `pdf_files.original_url` column.
- **Storage**: Uses upsert to handle duplicate filenames gracefully.
