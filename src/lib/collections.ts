export const groupBy = (list, keyGetter) => {
  const grouped = {};
  list.forEach((item) => {
    const key = keyGetter(item);
    if (!Object.keys(grouped).includes(key)) {
      grouped[key] = [item];
    } else {
      grouped[key].push(item);
    }
  });
  return grouped;
};
