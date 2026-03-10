-- Add display_name to variation_groups
-- name = unique internal identifier (e.g. "สี - ประตูเมลามีน")
-- display_name = customer-facing label (e.g. "สี")

ALTER TABLE variation_groups
  ADD COLUMN display_name text;
