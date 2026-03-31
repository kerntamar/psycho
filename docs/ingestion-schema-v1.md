# Ingestion Schema v1 (Supabase)

This schema is designed for importing PDF sources, extracting questions/options/answers,
and publishing reviewed content into a reusable question bank.

## Core flow

1. Add PDF source row to `document_sources`.
2. Create `import_jobs` row and track parsing lifecycle.
3. Persist page text in `document_pages`.
4. Group content via `topic_sections` and `question_sets`.
5. Store extracted questions in `questions` + `question_options`.
6. Store answer keys/rationales in `answer_keys` and optional `answer_explanations`.
7. Maintain traceability via `question_provenance`.
8. Pair simulation files with their solution files using `document_pairs`.

## Notes

- `topic_sections.intro_text` stores topic-level introductions/explanations.
- `answer_keys.explanation` stores per-question official rationale where available.
- `answer_explanations` can store additional editorial/AI explanations.
- RLS is enabled for all tables; policies should be added in follow-up migration.
