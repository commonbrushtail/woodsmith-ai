-- Migration 033: Add selected_variations JSONB column to quotations table
-- Stores all variation selections as an array of { label, value } objects
-- e.g. [{"label":"สี","value":"Oak 20638"},{"label":"พื้นผิว","value":"ลายเสี้ยนไม้"}]

ALTER TABLE quotations ADD COLUMN IF NOT EXISTS selected_variations jsonb;
