-- Migration 032: Add quantity and message columns to quotations table
-- These columns are referenced by submitQuotation() in src/lib/actions/customer.js
-- and validated by quotationCreateSchema in src/lib/validations/quotations.js
-- but were never added to the initial schema (001_initial_schema.sql).

ALTER TABLE quotations ADD COLUMN IF NOT EXISTS quantity integer;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS message text;
