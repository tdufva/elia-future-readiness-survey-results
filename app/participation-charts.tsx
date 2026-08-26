import worldAtlas from "@d3-maps/atlas/world/countries/countries-110m";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";

type CountryDatum = { iso3: string; label: string };

const representedCountries: CountryDatum[] = [
  { iso3: "AUT", label: "Austria" },
  { iso3: "BEL", label: "Belgium" },
  { iso3: "EGY", label: "Egypt" },
  { iso3: "FIN", label: "Finland" },
  { iso3: "DEU", label: "Germany" },
  { iso3: "IRL", label: "Ireland" },
  { iso3: "ITA", label: "Italy" },
  { iso3: "NLD", label: "Netherlands" },
  { iso3: "NOR", label: "Norway" },
  { iso3: "POL", label: "Poland" },
  { iso3: "PRT", label: "Portugal" },
  { iso3: "SRB", label: "Serbia" },
  { iso3: "ESP", label: "Spain" },
  { iso3: "SWE", label: "Sweden" },
  { iso3: "CHE", label: "Switzerland" },
  { iso3: "UKR", label: "Ukraine" },
  { iso3: "GBR", label: "United Kingdom" },
  { iso3: "USA", label: "United States" },
];

const ageGroups = [
  { label: "Under 35", count: 10, percent: 26, color: "var(--signal)" },
  { label: "35–44", count: 5, percent: 13, color: "var(--green)" },
  { label: "45–54", count: 13, percent: 34, color: "var(--gold)" },
  { label: "55+", count: 10, percent: 26, color: "var(--signal-dark)" },
];

export function CountryMap() {
  const topology = worldAtlas as unknown as Parameters<typeof feature>[0];
  const worldObject = (worldAtlas as unknown as { objects: { features: Parameters<typeof feature>[1] } }).objects.features;
  const collection = feature(topology, worldObject) as GeoJSON.FeatureCollection<GeoJSON.Geometry, { id: string; name?: string; name_long?: string }>;
  const projection = geoNaturalEarth1().fitExtent([[8, 8], [952, 492]], collection);
  const path = geoPath(projection);
  const represented = new Set(representedCountries.map((country) => country.iso3));
  const names = new Map(representedCountries.map((country) => [country.iso3, country.label]));

  return <div className="country-map-block">
    <div className="map-figure">
      <svg viewBox="0 0 960 500" role="img" aria-labelledby="country-map-title country-map-desc">
        <title id="country-map-title">Countries represented in the substantive survey responses</title>
        <desc id="country-map-desc">A world map highlights 18 countries in Europe, North America and North Africa. The map encodes presence, not respondent frequency.</desc>
        {collection.features.map((country) => {
          const iso3 = country.properties?.id ?? "";
          const isRepresented = represented.has(iso3);
          const d = path(country) ?? undefined;
          return <path
            key={iso3}
            d={d}
            className={isRepresented ? "map-country map-country--represented" : "map-country"}
            aria-label={isRepresented ? `${names.get(iso3)} represented` : undefined}
          />;
        })}
      </svg>
      <div className="map-legend" aria-label="Map legend"><span><i className="map-swatch" />Country represented</span><span>Presence only · frequency intentionally not mapped</span></div>
    </div>
    <ul className="country-count-list" aria-label="Countries represented">
      {representedCountries.map((country) => <li key={country.iso3}><span>{country.label}</span></li>)}
    </ul>
    <p className="chart-footnote">Country records current place of work, study or residence—not nationality. The map does not show country-level counts and is not cross-tabulated with other characteristics.</p>
  </div>;
}

export function AgeChart() {
  return <article className="demographic-chart demographic-chart--age">
    <div><p className="eyebrow">Age distribution</p><h3>All 38 respondents reported an age group.</h3></div>
    <div className="pie-layout">
      <div className="age-pie" role="img" aria-label="Age distribution: under 35, 10 respondents or 26 percent; age 35 to 44, 5 or 13 percent; age 45 to 54, 13 or 34 percent; age 55 and older, 10 or 26 percent." />
      <ul className="pie-legend">{ageGroups.map((group) => <li key={group.label}><i style={{ background: group.color }} /><span>{group.label}</span><strong>{group.count} <small>{group.percent}%</small></strong></li>)}</ul>
    </div>
    <p className="chart-footnote">Original bands were combined into four broader groups for a legible small-sample view. Rounded percentages total 99%.</p>
  </article>;
}
