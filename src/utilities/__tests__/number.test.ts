import { roundNumber, truncateNumber } from "../number.util";

describe("number.util", () => {
  describe("roundNumber", () => {
    const cases = [
      { decimals: 0, expected: 0, value: 0 },
      { decimals: 0, expected: 1, value: 1.4 },
      { decimals: 0, expected: 2, value: 1.5 },
      { decimals: 2, expected: 2, value: 1.999 },
      { decimals: 2, expected: 1.56, value: 1.555 },
      { decimals: 4, expected: 1.99, value: 1.99 },
      { decimals: -1, expected: 2, value: 1.99 },
    ];

    test.each(cases)("round '$value' to $decimals places", ({ decimals, expected, value }) => {
      const rounded = roundNumber(value, decimals);
      expect(rounded).toBe(expected);
    });
  });

  describe("truncateNumber", () => {
    const cases = [
      { decimals: 0, expected: 0, value: 0 },
      { decimals: 0, expected: 1, value: 1.9 },
      { decimals: 1, expected: 1.9, value: 1.999 },
      { decimals: 4, expected: 1.99, value: 1.99 },
      { decimals: -1, expected: 1, value: 1.99 },
    ];

    test.each(cases)("truncate '$value' to $decimals places", ({ decimals, expected, value }) => {
      const truncated = truncateNumber(value, decimals);
      expect(truncated).toBe(expected);
    });
  });
});
