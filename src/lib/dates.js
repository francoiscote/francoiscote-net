const MS_DAYS = 24 * 60 * 60 * 1000;

export const daysSince = (d) => {
  const today = new Date();
  const date = new Date(d);

  return Math.round((today.getTime() - date.getTime()) / MS_DAYS);
};
