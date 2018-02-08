/** Return only the numeric fields plus the name from the row
 */
export function cleanRow(row) {
  const out = {
    name: row["P. Name"]
  }

  // Copy over numeric fields and coerce into numeric type
  numericColumns.forEach(c => {
    out[c] = +row[c]
  });

  return out;
}


export const numericColumns = [
  // "P. Name",
  // "P. Name Kepler",
  // "P. Name KOI",
  // "P. Zone Class",
  // "P. Mass Class",
  // "P. Composition Class",
  // "P. Atmosphere Class",
  // "P. Habitable Class",
  "P. Min Mass (EU)",
  "P. Mass (EU)",
  "P. Max Mass (EU)",
  "P. Radius (EU)",
  "P. Density (EU)",
  "P. Gravity (EU)",
  "P. Esc Vel (EU)",
  "P. SFlux Min (EU)",
  "P. SFlux Mean (EU)",
  "P. SFlux Max (EU)",
  "P. Teq Min (K)",
  "P. Teq Mean (K)",
  "P. Teq Max (K)",
  "P. Ts Min (K)",
  "P. Ts Mean (K)",
  "P. Ts Max (K)",
  "P. Surf Press (EU)",
  "P. Mag",
  "P. Appar Size (deg)",
  "P. Period (days)",
  "P. Sem Major Axis (AU)",
  "P. Eccentricity",
  "P. Mean Distance (AU)",
  "P. Inclination (deg)",
  "P. Omega (deg)",
  // "S. Name",
  // "S. Name HD",
  // "S. Name HIP",
  // "S. Constellation",
  // "S. Type",
  "S. Mass (SU)",
  "S. Radius (SU)",
  "S. Teff (K)",
  "S. Luminosity (SU)",
  "S. [Fe/H]",
  "S. Age (Gyrs)",
  "S. Appar Mag",
  "S. Distance (pc)",
  "S. RA (hrs)",
  "S. DEC (deg)",
  "S. Mag from Planet",
  "S. Size from Planet (deg)",
  "S. No. Planets",
  "S. No. Planets HZ",
  "S. Hab Zone Min (AU)",
  "S. Hab Zone Max (AU)",
  "P. HZD",
  "P. HZC",
  "P. HZA",
  "P. HZI",
  "P. SPH",
  "P. Int ESI",
  "P. Surf ESI",
  "P. ESI",
  "S. HabCat",
  "P. Habitable",
  "P. Hab Moon",
  "P. Confirmed",
  // "P. Disc. Method",
  "P. Disc. Year"
];
