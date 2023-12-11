export const groupBy = <I>(
  list: Array<I>,
  keyGetter: (I) => string
): {
  [key: string]: Array<I>;
} => {
  const grouped: {
    [key: string]: Array<I>;
  } = {};

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
