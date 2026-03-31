-- v1 ingestion schema for PDF -> question bank pipeline

create extension if not exists pgcrypto;

-- ---- Enum-like constraints via check constraints keep migrations flexible. ----

create table if not exists public.document_sources (
  id uuid primary key default gen_random_uuid(),
  title text,
  url text not null unique,
  filename text,
  doc_type text not null check (doc_type in (
    'course_book',
    'simulation',
    'simulation_solution',
    'full_solution',
    'auxiliary'
  )),
  subject text,
  language text not null default 'he',
  exam_year int,
  exam_season text check (exam_season in ('spring', 'summer', 'fall', 'winter')),
  simulation_number int,
  part_number int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_pairs (
  id uuid primary key default gen_random_uuid(),
  question_doc_id uuid not null references public.document_sources(id) on delete cascade,
  solution_doc_id uuid not null references public.document_sources(id) on delete cascade,
  pair_type text not null check (pair_type in ('simulation_to_solution', 'book_to_answer_key')),
  confidence numeric(5,4),
  notes text,
  created_at timestamptz not null default now(),
  unique (question_doc_id, solution_doc_id, pair_type)
);

create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.document_sources(id) on delete cascade,
  status text not null check (status in ('queued', 'running', 'succeeded', 'failed')),
  started_at timestamptz,
  finished_at timestamptz,
  pages_total int,
  pages_processed int not null default 0,
  extractor_version text,
  error_log jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.document_pages (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.document_sources(id) on delete cascade,
  page_number int not null,
  raw_text text,
  ocr_text text,
  has_images boolean not null default false,
  hash text,
  created_at timestamptz not null default now(),
  unique (source_id, page_number)
);

create table if not exists public.topic_sections (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.document_sources(id) on delete set null,
  topic_name text not null,
  intro_title text,
  intro_text text,
  display_order int,
  page_start int,
  page_end int,
  created_at timestamptz not null default now()
);

create table if not exists public.question_sets (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.document_sources(id) on delete set null,
  topic_section_id uuid references public.topic_sections(id) on delete set null,
  set_type text not null check (set_type in ('chapter', 'section', 'simulation', 'exercise_block')),
  name text,
  section_order int,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.passages (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.document_sources(id) on delete set null,
  topic_section_id uuid references public.topic_sections(id) on delete set null,
  title text,
  content text not null,
  page_start int,
  page_end int,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  question_set_id uuid references public.question_sets(id) on delete set null,
  source_id uuid references public.document_sources(id) on delete set null,
  topic_section_id uuid references public.topic_sections(id) on delete set null,
  passage_id uuid references public.passages(id) on delete set null,
  question_number text,
  question_type text not null check (question_type in ('mcq', 'open', 'true_false', 'essay')),
  stem text not null,
  difficulty text,
  topic text,
  page_start int,
  page_end int,
  status text not null default 'extracted' check (status in ('extracted', 'reviewed', 'published', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_key text not null,
  option_text text not null,
  sort_order int,
  created_at timestamptz not null default now(),
  unique (question_id, option_key)
);

create table if not exists public.answer_keys (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  correct_option_key text,
  correct_text text,
  explanation text,
  source_solution_doc_id uuid references public.document_sources(id) on delete set null,
  confidence numeric(5,4),
  created_at timestamptz not null default now(),
  unique (question_id)
);

create table if not exists public.answer_explanations (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  explanation_type text not null check (explanation_type in ('official', 'editorial', 'ai')),
  content text not null,
  source_id uuid references public.document_sources(id) on delete set null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.question_provenance (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  source_id uuid not null references public.document_sources(id) on delete cascade,
  page_number int not null,
  bbox jsonb,
  snippet text,
  extraction_method text not null check (extraction_method in ('text', 'ocr', 'manual')),
  created_at timestamptz not null default now()
);

create index if not exists idx_document_sources_doc_type on public.document_sources (doc_type);
create index if not exists idx_document_sources_simulation on public.document_sources (simulation_number);
create index if not exists idx_import_jobs_source_id on public.import_jobs (source_id);
create index if not exists idx_document_pages_source_page on public.document_pages (source_id, page_number);
create index if not exists idx_questions_source_id on public.questions (source_id);
create index if not exists idx_questions_status on public.questions (status);
create index if not exists idx_question_options_question on public.question_options (question_id);
create index if not exists idx_answer_keys_question on public.answer_keys (question_id);
create index if not exists idx_question_provenance_question on public.question_provenance (question_id);

-- Enable RLS (policies can be added in a follow-up migration)
alter table public.document_sources enable row level security;
alter table public.document_pairs enable row level security;
alter table public.import_jobs enable row level security;
alter table public.document_pages enable row level security;
alter table public.topic_sections enable row level security;
alter table public.question_sets enable row level security;
alter table public.passages enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.answer_keys enable row level security;
alter table public.answer_explanations enable row level security;
alter table public.question_provenance enable row level security;
