/** Round a number to a maximum number of decimals */
export const roundNumber = (value: number, decimals: number) => {
  const multiplier = decimals ? Math.pow(10, Math.abs(decimals)) : 1;
  return Math.round(value * multiplier) / multiplier;
};

/** Truncate a number to a maximum number of decimals (no rounding) */
export const truncateNumber = (value: number, decimals: number) => {
  const safeDecimals = decimals > 0 ? decimals : 0;
  const multiplier = safeDecimals ? Math.pow(10, safeDecimals) : 1;
  return parseInt(`${value * multiplier}`, 10) / multiplier;
};
