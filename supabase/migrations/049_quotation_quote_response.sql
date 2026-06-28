-- Quote-back: the admin's customer-visible response to a quotation request.
-- Distinct from admin_notes (internal only). quote_message + quoted_amount are
-- shown to the customer on /account/quotations; quoted_at marks when sent.

ALTER TABLE quotations ADD COLUMN IF NOT EXISTS quoted_amount numeric(12, 2);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS quote_message text;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS quoted_at timestamptz;
