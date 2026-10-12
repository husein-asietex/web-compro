INSERT INTO "NetworkLocation" (
  "id", "slug", "name", "country", "city", "address", "kind", "order", "status", "createdAt", "updatedAt"
)
VALUES
  (
    'dummy-network-indonesia',
    'indonesia-hq',
    'Asietex Headquarters & Factory',
    'Indonesia',
    'Jakarta',
    'Dummy address — replace with approved company address',
    'HQ & Factory',
    1,
    'PUBLISHED',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'dummy-network-portugal',
    'europe-warehouse',
    'Europe Warehouse',
    'Portugal',
    'Porto',
    'Dummy address — replace before production',
    'Warehouse',
    2,
    'PUBLISHED',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "MediaAsset" (
  "id", "url", "altEn", "altId", "altPt", "credit", "approved", "divisionId", "createdAt"
)
SELECT
  'dummy-media-' || division."slug",
  'https://placehold.co/1200x800/png?text=Asietex+' || division."slug",
  division."slug" || ' textile production placeholder',
  'Placeholder produksi tekstil ' || division."slug",
  'Placeholder de produção têxtil ' || division."slug",
  'Dummy placeholder — replace before production',
  true,
  division."id",
  CURRENT_TIMESTAMP
FROM "Division" AS division
ON CONFLICT ("id") DO NOTHING;
