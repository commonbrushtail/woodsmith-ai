-- Add SELECT policy for authenticated admins
-- This allows admins to read back the data they just saved
CREATE POLICY "Allow admin read access to site_settings"
  ON site_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );
