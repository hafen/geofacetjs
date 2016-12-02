export const getXYData = (data, properties, type, varNum) => {
  const res = [];
  if (type === 'country') {
    const code = properties.adm0_a3_us;
    data.countries[code].data.map(d => res.push({ x: d.year, y: d.value }));
  } else if (type === 'province') {
    const ccode = properties.adm0_a3; // should check adm0_a3 is always same as _a3_us
    const code = properties.adm1_code;
    if (data[ccode] && data[ccode][varNum] && data[ccode][varNum].provinces) {
      data[ccode][varNum].provinces[code].data.map(
        d => res.push({ x: d.year, y: d.value }));
    }
  }
  return res;
};

export const hexToRGB = (hex, bhex, a = 1, a2 = a) => {
  const h = '0123456789ABCDEF';
  const hx = hex.toUpperCase();
  const bhx = bhex.toUpperCase();
  const r3 = (h.indexOf(hx[1]) * 16) + h.indexOf(hx[2]);
  const g3 = (h.indexOf(hx[3]) * 16) + h.indexOf(hx[4]);
  const b3 = (h.indexOf(hx[5]) * 16) + h.indexOf(hx[6]);
  const r2 = (h.indexOf(bhx[1]) * 16) + h.indexOf(bhx[2]);
  const g2 = (h.indexOf(bhx[3]) * 16) + h.indexOf(bhx[4]);
  const b2 = (h.indexOf(bhx[5]) * 16) + h.indexOf(bhx[6]);

  // http://stackoverflow.com/questions/12228548/finding-equivaent-color-with-opacity
  const r1 = Math.max(Math.min(((r3 - r2) + (r2 * a)) / a, 255), 0);
  const g1 = Math.max(Math.min(((g3 - g2) + (g2 * a)) / a, 255), 0);
  const b1 = Math.max(Math.min(((b3 - b2) + (b2 * a)) / a, 255), 0);

  return `rgba(${r1}, ${g1}, ${b1}, ${a2})`;
};
