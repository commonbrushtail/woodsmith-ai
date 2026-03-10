-- Allow guest quotation submissions (no phone required)
ALTER TABLE quotations ALTER COLUMN requester_phone DROP NOT NULL;
