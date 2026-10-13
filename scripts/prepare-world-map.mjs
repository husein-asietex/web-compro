import { writeFile } from "node:fs/promises";

const mapPath = new URL(
  "../public/maps/world-countries.geojson",
  import.meta.url,
);
const sourceUrl =
  "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson";

const activeMarketIds = new Set([
  "076", // Brazil
  "116", // Cambodia
  "144", // Sri Lanka
  "156", // China
  "250", // France
  "360", // Indonesia
  "380", // Italy
  "620", // Portugal
  "704", // Vietnam
  "840", // United States of America
]);

const response = await fetch(sourceUrl);

if (!response.ok) {
  throw new Error(`Could not download world map data (${response.status}).`);
}

const world = await response.json();

function crossesAntimeridian(ring) {
  return ring.some(
    (coordinate, index) =>
      index > 0 && Math.abs(coordinate[0] - ring[index - 1][0]) > 180,
  );
}

function splitAntarcticaAtPrimeMeridian(ring) {
  const westPoleIndex = ring.findIndex(
    ([longitude, latitude]) => longitude === -180 && latitude === -90,
  );

  if (westPoleIndex < 0) {
    throw new Error("Could not find Antarctica's western pole coordinate.");
  }

  const boundary = ring.slice(westPoleIndex + 1);
  const crossingIndex = boundary.findIndex(
    ([longitude], index) =>
      longitude <= 0 && (boundary[index + 1]?.[0] ?? -1) >= 0,
  );

  if (crossingIndex < 0) {
    throw new Error("Could not find Antarctica's prime-meridian crossing.");
  }

  const [westLongitude, westLatitude] = boundary[crossingIndex];
  const [eastLongitude, eastLatitude] = boundary[crossingIndex + 1];
  const ratio = (0 - westLongitude) / (eastLongitude - westLongitude);
  const crossing = [0, westLatitude + (eastLatitude - westLatitude) * ratio];

  const westRing = [
    [-180, -90],
    ...boundary.slice(0, crossingIndex + 1),
    crossing,
    [0, -90],
    [-180, -90],
  ];
  const eastRing = [
    [0, -90],
    crossing,
    ...boundary.slice(crossingIndex + 1),
    [180, -90],
    [0, -90],
  ];

  return [westRing, eastRing];
}

for (const country of world.features) {
  const sourceProperties = country.properties;
  const sourceIsoNumeric =
    String(sourceProperties.ISO_N3) === "-99"
      ? sourceProperties.ISO_N3_EH
      : sourceProperties.ISO_N3;
  const isoNumeric = String(sourceIsoNumeric).padStart(3, "0");

  country.properties = {
    name: sourceProperties.NAME_LONG ?? sourceProperties.ADMIN,
    isoNumeric,
    active: activeMarketIds.has(isoNumeric),
  };

  if (isoNumeric !== "010" || country.geometry.type !== "MultiPolygon") {
    continue;
  }

  country.geometry.coordinates = country.geometry.coordinates.flatMap(
    (polygon) => {
      const [outerRing, ...innerRings] = polygon;
      if (!crossesAntimeridian(outerRing)) {
        return [polygon];
      }

      if (innerRings.length > 0) {
        throw new Error(
          "Antarctica's dateline polygon unexpectedly has holes.",
        );
      }

      return splitAntarcticaAtPrimeMeridian(outerRing).map((ring) => [ring]);
    },
  );
}

await writeFile(mapPath, `${JSON.stringify(world)}\n`, "utf8");
