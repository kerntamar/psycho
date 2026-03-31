-- Minimal policies so authenticated admins can insert/read ingestion tables from admin UI.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='document_sources' AND policyname='authenticated can read document_sources'
  ) THEN
    CREATE POLICY "authenticated can read document_sources"
    ON public.document_sources
    FOR SELECT
    USING (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='document_sources' AND policyname='authenticated can insert document_sources'
  ) THEN
    CREATE POLICY "authenticated can insert document_sources"
    ON public.document_sources
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='import_jobs' AND policyname='authenticated can read import_jobs'
  ) THEN
    CREATE POLICY "authenticated can read import_jobs"
    ON public.import_jobs
    FOR SELECT
    USING (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='import_jobs' AND policyname='authenticated can insert import_jobs'
  ) THEN
    CREATE POLICY "authenticated can insert import_jobs"
    ON public.import_jobs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='questions' AND policyname='authenticated can read questions'
  ) THEN
    CREATE POLICY "authenticated can read questions"
    ON public.questions
    FOR SELECT
    USING (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='question_options' AND policyname='authenticated can read question_options'
  ) THEN
    CREATE POLICY "authenticated can read question_options"
    ON public.question_options
    FOR SELECT
    USING (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='answer_keys' AND policyname='authenticated can read answer_keys'
  ) THEN
    CREATE POLICY "authenticated can read answer_keys"
    ON public.answer_keys
    FOR SELECT
    USING (auth.role() = 'authenticated');
  END IF;
END$$;
