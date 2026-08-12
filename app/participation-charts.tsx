import worldAtlas from "@d3-maps/atlas/world/countries/countries-110m";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";

type CountryDatum = { iso3: string; label: string };

const representedCountries: CountryDatum[] = [
  { iso3: "GBR", label: "United Kingdom" },
  { iso3: "DEU", label: "Germany" },
  { iso3: "NLD", label: "Netherlands" },
  { iso3: "CHE", label: "Switzerland" },
  { iso3: "AUT", label: "Austria" },
  { iso3: "FIN", label: "Finland" },
  { iso3: "ITA", label: "Italy" },
  { iso3: "NOR", label: "Norway" },
  { iso3: "PRT", label: "Portugal" },
  { iso3: "SWE", label: "Sweden" },
  { iso3: "UKR", label: "Ukraine" },
  { iso3: "USA", label: "United States" },
  { iso3: "EGY", label: "Egypt" },
  { iso3: "IRL", label: "Ireland" },
  { iso3: "POL", label: "Poland" },
  { iso3: "SRB", label: "Serbia" },
  { iso3: "ESP", label: "Spain" },
];

const ageGroups = [
  { label: "Under 35", count: 9, percent: 26, color: "var(--signal)" },
  { label: "35–44", count: 4, percent: 12, color: "var(--green)" },
  { label: "45–54", count: 11, percent: 32, color: "var(--gold)" },
  { label: "55+", count: 10, percent: 29, color: "var(--signal-dark)" },
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
        <desc id="country-map-desc">A world map highlights 17 countries in Europe, North America and North Africa. The map encodes presence, not respondent frequency.</desc>
        {collection.features.map((country) => {
          const iso3 = country.properties?.id ?? "";
          const isRepresented = represented.has(iso3);
          const d = path(country) ?? undefined;
          return <path
            key={iso3}
            d={d}
            className={isRepresented ? "map-country map-country--represented" : "map-country"}
          >{isRepresented && <title>{names.get(iso3)} represented</title>}</path>;
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

export function DemographicCharts() {
  return <div className="demographic-charts">
    <article className="demographic-chart">
      <div><p className="eyebrow">Age distribution</p><h3>All 34 respondents reported an age group.</h3></div>
      <div className="pie-layout">
        <div className="age-pie" role="img" aria-label="Age distribution: under 35, 9 respondents or 26 percent; age 35 to 44, 4 or 12 percent; age 45 to 54, 11 or 32 percent; age 55 and older, 10 or 29 percent." />
        <ul className="pie-legend">{ageGroups.map((group) => <li key={group.label}><i style={{ background: group.color }} /><span>{group.label}</span><strong>{group.count} <small>{group.percent}%</small></strong></li>)}</ul>
      </div>
      <p className="chart-footnote">Original bands were combined into four broader groups for a legible small-sample view. Rounded percentages total 99%.</p>
    </article>
    <article className="demographic-chart demographic-chart--missing">
      <div><p className="eyebrow">Sex and gender</p><h3>No pie chart can be calculated.</h3></div>
      <div className="missing-data-mark" aria-label="Sex and gender data were not collected"><strong>Not collected</strong><span>The survey workbook contains no sex or gender question.</span></div>
      <p className="chart-footnote">The absence is reported rather than inferred from names, roles, countries or written answers.</p>
    </article>
  </div>;
}
