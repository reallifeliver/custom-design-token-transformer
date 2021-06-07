function getHex(rgba) {
  const match = rgba.match(/^rgba?\(([0-9,/\s]*)\)/i);
  if (!match || !match[1]) return rgba;
  const [r, g, b, a] = match[1]
    .replace(/\s/g, '')
    .split(',')
    .map((el) => Number(el));

  if (!!a && a < 1) return rgba; // opacity가 적용되어 있는 경우 rgba 유지

  return `#${toDecimal(r) + toDecimal(g) + toDecimal(b)}`;
}

function toDecimal(num) {
  let decimal = num.toString(16);
  return decimal.length === 1 ? '0' + decimal : decimal;
}

exports.default = getHex;
