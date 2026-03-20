import os
import csv
import requests
import uuid
import re
import argparse
from typing import Optional, Dict
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.environ.get("SUPABASE_BUCKET", "source-pdfs")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Subject inference rules
SUBJECT_KEYWORDS = {
    "english": ["אנגלית", "english"],
    "hebrew": ["מילולי", "חשיבה מילולית", "עברית", "לשון", "פסקה", "חיבור"],
    "vocabulary": ["מילים", "אוצר מילים", "vocabulary"],
    "math": ["אלגברה", "גיאומטריה", "בעיות", "תרשימים", "כמותי", "מתמט"],
    "simulations": ["סימולציה", "פתרון", "תשובות"]
}

def infer_subject(title: str) -> str:
    title_lower = title.lower()

    # Check for simulations first as it might contain other keywords
    for keyword in SUBJECT_KEYWORDS["simulations"]:
        if keyword in title_lower:
            return "simulations"

    for subject, keywords in SUBJECT_KEYWORDS.items():
        if subject == "simulations": continue
        for keyword in keywords:
            if keyword in title_lower:
                return subject

    return "math"  # Fallback

def get_subject_id(slug: str) -> Optional[str]:
    # In a real scenario, we'd query the subjects table
    # For now, let's assume we can map slugs to IDs if needed or just use slugs if allowed
    # PRD says subject_id (uuid -> subjects.id)
    response = supabase.table("subjects").select("id").eq("slug", slug).execute()
    if response.data:
        return response.data[0]["id"]

    # If simulation or misc, we might need a default subject or handle it differently
    # For now, let's fallback to math if not found
    if slug == "simulations":
        response = supabase.table("subjects").select("id").eq("slug", "math").execute()
        if response.data:
            return response.data[0]["id"]

    return None

def clean_filename(title: str) -> str:
    # Remove non-alphanumeric characters and replace spaces with underscores
    clean = re.sub(r'[^\w\s-]', '', title).strip()
    clean = re.sub(r'[-\s]+', '_', clean)
    return clean

def build_storage_path(subject: str, filename: str) -> str:
    if subject == "simulations":
        return f"simulations/math/{filename}.pdf"
    return f"{subject}/{subject}/{filename}.pdf"

def process_csv(file_path: str, limit: Optional[int] = None, dry_run: bool = False):
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found.")
        return

    with open(file_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        count = 0

        for row in reader:
            if limit and count >= limit:
                break

            url = row.get("URL")
            text = row.get("Text")

            if not url or not url.endswith(".pdf"):
                continue

            print(f"\nProcessing: {text}")

            # 1. Subject Inference
            inferred_subj = infer_subject(text)
            print(f"  Inferred Subject: {inferred_subj}")

            # 2. Duplicate Handling (DB)
            existing = supabase.table("pdf_files").select("id").eq("original_url", url).execute()
            if existing.data:
                print(f"  Skipping: URL already exists in database.")
                count += 1
                continue

            # 3. Build Storage Path
            filename = clean_filename(text)
            storage_path = build_storage_path(inferred_subj, filename)
            print(f"  Storage Path: {storage_path}")

            if dry_run:
                print("  DRY RUN: Skipping download and upload.")
                count += 1
                continue

            # 4. Download PDF
            try:
                response = requests.get(url, timeout=30)
                response.raise_for_status()
                pdf_content = response.content
            except Exception as e:
                print(f"  Error downloading {url}: {e}")
                continue

            # 5. Upload to Supabase Storage
            try:
                # Check if file already exists in storage to avoid crash
                # (Standard Supabase upload will error if file exists)
                supabase.storage.from_(SUPABASE_BUCKET).upload(
                    path=storage_path,
                    file=pdf_content,
                    file_options={"content-type": "application/pdf", "x-upsert": "true"}
                )
                print("  Uploaded to storage.")
            except Exception as e:
                print(f"  Storage Error (might already exist): {e}")
                # We continue as we still want the DB row if missing

            # 6. Insert Row into pdf_files
            subject_id = get_subject_id(inferred_subj if inferred_subj != "simulations" else "math")

            insert_data = {
                "title": text,
                "file_path": storage_path,
                "original_url": url,
                "subject_id": subject_id,
                "processing_status": "uploaded",
                "source_type": "official"
            }

            try:
                supabase.table("pdf_files").insert(insert_data).execute()
                print("  Database row created.")
            except Exception as e:
                print(f"  Database Error: {e}")

            count += 1

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Campus.gov.il PDFs to Supabase")
    parser.add_argument("--limit", type=int, help="Limit number of processed rows")
    parser.add_argument("--dry-run", action="store_true", help="Do not upload or insert data")
    parser.add_argument("--csv", default="data/campus_pdf_links_clean.csv", help="Path to input CSV")

    args = parser.parse_args()

    process_csv(args.csv, limit=args.limit, dry_run=args.dry_run)
