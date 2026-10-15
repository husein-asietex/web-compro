# World countries map data

- Source: Natural Earth, `ne_110m_admin_0_countries.geojson`, version 5.1.2.
- Source URL: https://github.com/nvkelso/natural-earth-vector/tree/v5.1.2/geojson
- License: Natural Earth data is in the public domain.
- Regenerate with: `npm run map:prepare`.
- Local processing: properties were reduced to the country name, numeric ISO
  code, and market status. The Antarctic mainland was split at the prime
  meridian so no polygon ring crosses directly from `180°` to `-180°` when
  rendered by MapLibre.
