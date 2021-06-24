ALTER TABLE gifts ADD gift_order integer;
UPDATE gifts set gift_order = id;
ALTER TABLE gifts ALTER COLUMN gift_order SET NOT NULL;