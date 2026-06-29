-- Unify the quotation response flow. Sending a quote now also marks the request
-- answered (status -> 'approved'); declining is a first-class terminal action
-- that may carry an optional reason shown to the customer.
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS decline_reason text;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS declined_at timestamptz;

-- Backfill: rows quoted under the old code never had status bumped to 'approved'.
-- Treat any already-quoted request as answered so it lands in the "replied" tab.
UPDATE quotations SET status = 'approved' WHERE quoted_at IS NOT NULL AND status = 'pending';
