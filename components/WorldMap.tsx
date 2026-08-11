import { visitedPlaces } from "@/lib/photography";

/**
 * WorldMap
 *
 * Lightweight "where I've been" map ("Serene Bento" skin): an equirectangular
 * coordinate field (dot grid + graticule) with a pin per visited place, plotted
 * from lat/lon. No mapping library or heavy asset — pins are positioned by the
 * standard equirectangular projection. The place count is derived from the data.
 *
 * Used by: app/photography/page.tsx
 */
function project(lat: number, lon: number): { x: number; y: number } {
  return { x: ((lon + 180) / 360) * 100, y: ((90 - lat) / 180) * 100 };
}

export function WorldMap() {
  return (
    <div className="worldmap">
      <div aria-hidden="true" className="worldmap-canvas">
        {visitedPlaces.map((place) => {
          const { x, y } = project(place.lat, place.lon);
          return (
            <span
              className="worldmap-pin"
              key={place.name}
              style={{ left: `${x}%`, top: `${y}%` }}
              title={place.name}
            />
          );
        })}
      </div>
      <div className="worldmap-legend">
        <p className="worldmap-count">
          {visitedPlaces.length}{" "}
          {visitedPlaces.length === 1 ? "place" : "places"}
        </p>
        <ul className="worldmap-list">
          {visitedPlaces.map((place) => (
            <li key={place.name}>{place.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
