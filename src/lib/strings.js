export const capitalize = ([first, ...rest]) => {
  return first.toUpperCase() + rest.join("").toLowerCase();
};

export const formatKiloGrams = (kg) => {
  if (kg >= 1) {
    return `${kg}kg`;
  } else {
    return `${kg * 1000}g`;
  }
};
