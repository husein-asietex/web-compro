ALTER TABLE "SiteSetting"
ALTER COLUMN "catalogPlacements"
SET DEFAULT ARRAY['home', 'about', 'products', 'division', 'network', 'career', 'contact', 'footer']::TEXT[];
