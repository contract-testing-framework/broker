export const unique = function (array) {
  return array.filter((elem, index) => {
    const firstIndex = array.indexOf(elem);
    return index === firstIndex;
  });
};

export const uniqueBy = (arr, prop) => {
  if (!arr || arr.length === 0 || !prop) {
    return [];
  }

  return Object.values(
    arr.reduce((acc, item) => {
      acc[item[prop]] = item;
      return acc;
    }, {})
  );
};

export const uniqueByHash = (arr) => uniqueBy(arr, "hash");
export const uniqueById = (arr) => uniqueBy(arr, "id");
