import seedRandom from "seedrandom";
export const unique = function (array) {
  return array.filter((elem, index) => {
    const firstIndex = array.indexOf(elem);
    return index === firstIndex;
  });
};

export const uniqueBy = (arr, prop) => {
  return Object.values(
    arr.reduce((acc, item) => {
      acc[item[prop]] = item;
      return acc;
    }, {})
  );
};

export const uniqueByHash = (arr) => uniqueBy(arr, "hash");
export const uniqueById = (arr) => uniqueBy(arr, "id");

export function randomColorRGB(opacity = 1) {
  const red = Math.floor(Math.random() * 256);

  const green = Math.floor(Math.random() * 256);

  const blue = Math.floor(Math.random() * 256);

  return `rgba(${red},${green},${blue},${opacity})`;
}

export function randomColorHSL(maxS = 100, maxL = 100, opacity = 1, seed) {
  const seededRandom = seedRandom(seed);

  const hue = Math.floor(seededRandom(seed) * 360);
  const saturation = Math.floor(seededRandom(seed) * maxS);
  const lightness = Math.floor(seededRandom(seed) * maxL);
  const alpha = opacity;

  return `hsla(${hue},${saturation}%,${lightness}%,${alpha})`;
}
