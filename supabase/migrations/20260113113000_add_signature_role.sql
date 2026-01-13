-- Add role column to signatures table
ALTER TABLE signatures 
ADD COLUMN role TEXT DEFAULT 'Signer';
