-- ============================================================
-- Migration 021: FAQ Groups
-- Adds faq_groups table with image support, links faqs via FK
-- ============================================================

-- Step 1: Create faq_groups table
CREATE TABLE faq_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER faq_groups_updated_at
  BEFORE UPDATE ON faq_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Step 2: RLS
ALTER TABLE faq_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published faq groups"
  ON faq_groups FOR SELECT TO anon
  USING (published = true);

CREATE POLICY "Authenticated can read published faq groups"
  ON faq_groups FOR SELECT TO authenticated
  USING (published = true);

-- Step 3: Indexes
CREATE INDEX idx_faq_groups_sort ON faq_groups(sort_order);
CREATE INDEX idx_faq_groups_published ON faq_groups(published) WHERE published = true;

-- Step 4: Add group_id FK to faqs (nullable initially)
ALTER TABLE faqs ADD COLUMN group_id uuid REFERENCES faq_groups(id) ON DELETE CASCADE;

-- Step 5: Create default group and assign all existing FAQs to it
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM faqs) THEN
    INSERT INTO faq_groups (name, sort_order)
    VALUES ('ทั่วไป', 0);

    UPDATE faqs
    SET group_id = (SELECT id FROM faq_groups WHERE name = 'ทั่วไป' LIMIT 1)
    WHERE group_id IS NULL;
  END IF;
END $$;

-- Step 6: Make group_id NOT NULL
ALTER TABLE faqs ALTER COLUMN group_id SET NOT NULL;

-- Step 9: Index for FK lookups
CREATE INDEX idx_faqs_group_id ON faqs(group_id);
