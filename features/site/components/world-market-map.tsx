"use client";

import { Map, MapGeoJSON } from "@/components/ui/map";

type CountryMarketProperties = {
  name: string;
  isoNumeric: string;
  active: boolean;
};

export function WorldMarketMap({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="h-[20rem] w-full overflow-hidden rounded-2xl md:h-[30rem]"
    >
      <div aria-hidden="true" className="h-full w-full">
        <Map
          blank
          interactive={false}
          attributionControl={false}
          bounds={[-180, -60, 180, 85]}
          fitBoundsOptions={{ padding: 8 }}
          bearing={0}
          pitch={0}
          className="pointer-events-none h-full w-full"
        >
          <MapGeoJSON<CountryMarketProperties>
            id="international-market-countries"
            data="/maps/world-countries.geojson"
            interactive={false}
            fillPaint={{
              "fill-color": [
                "case",
                ["boolean", ["get", "active"], false],
                "#d8c18d",
                "#f8f7f2",
              ],
              "fill-opacity": [
                "case",
                ["boolean", ["get", "active"], false],
                1,
                0.15,
              ],
            }}
            linePaint={{
              "line-color": "rgba(248, 247, 242, 0.28)",
              "line-width": 0.55,
            }}
          />
        </Map>
      </div>
    </div>
  );
}
