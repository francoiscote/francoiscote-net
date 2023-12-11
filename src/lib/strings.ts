export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatKiloGrams = (kg: number) => {
  if (kg >= 1) {
    return `${kg}kg`;
  } else {
    return `${kg * 1000}g`;
  }
};
