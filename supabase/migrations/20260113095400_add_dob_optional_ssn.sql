-- Add date_of_birth field and make ssn nullable
ALTER TABLE signatures
ADD COLUMN date_of_birth DATE;

-- Make SSN nullable
ALTER TABLE signatures
ALTER COLUMN ssn DROP NOT NULL;
