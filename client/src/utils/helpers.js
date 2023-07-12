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

export function randomColor(opacity = 1) {
  const red = Math.floor(Math.random() * 256);

  const green = Math.floor(Math.random() * 256);

  const blue = Math.floor(Math.random() * 256);

  return `rgba(${red},${green},${blue},${opacity})`;
}
