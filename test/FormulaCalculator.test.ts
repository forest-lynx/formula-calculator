import { describe, it, expect, beforeEach } from 'vitest';
import FormulaCalculator from '../src/FormulaCalculator';

describe("FormulaCalculator", () => {
  let calculator: FormulaCalculator;
  let calculatorRu: FormulaCalculator;
  //let consoleSpy: vi.MockedFunction<typeof console.error>;

  beforeEach(() => {
    calculator = new FormulaCalculator({
      decimalSeparator: ".",
      thousandsSeparator: ",",
      fractionDigits: 2,
      min: -100,
      max: 500,
    });
    calculatorRu = new FormulaCalculator({
      decimalSeparator: ",",
      thousandsSeparator: " ",
      fractionDigits: 2,
      min: -100,
      max: 500,
    });
    //consoleSpy = vi.spyOn(console, 'error');
  });

  /*afterEach(() => {
    consoleSpy.mockRestore();
  });*/

  it('should format value correctly', () => {
    expect(calculator.format(12345.6789)).toBe('12,345.68');
    expect(calculator.format(0.1234)).toBe('0.12');
  });

  it("should return null for non-numeric input", () => {
    expect(calculator.parse("abc")).toBeNull();
    expect(calculator.parse("2+3x")).toBeNull();
  });

  it("should handle decimal separators correctly", () => {
    expect(calculator.parse("3.14")).toBe(3.14);
    expect(calculatorRu.parse("0,5")).toBe(0.5);
  });

  it("should handle thousands separators correctly", () => {
    expect(calculator.parse("1,000")).toBe(1000);
    expect(calculator.parse("12,345.67")).toBe(12345.67);
    expect(calculatorRu.parse("12 345,67")).toBe(12345.67);
    expect(calculatorRu.parse("1 000")).toBe(1000);
  });

  it("should handle negative numbers", () => {
    expect(calculator.parse("-10")).toBe(-10);
    expect(calculator.parse("-0.5")).toBe(-0.5);
  });

  it("should handle leading and trailing whitespace", () => {
    expect(calculator.parse("  42  ")).toBe(42);
    expect(calculator.parse("\t10.5\n")).toBe(10.5);
  });

  it("should handle empty input", () => {
    expect(calculator.calculate("")).toBeNull();
  });

  it("should handle simple expressions", () => {
    expect(calculator.calculate("2+3")).toBe(5);
    expect(calculator.calculate("2,3+31.48")).toBe(33.78);
    expect(calculator.calculate("2-3")).toBe(-1);
    expect(calculator.calculate("2*3")).toBe(6);
    expect(calculator.calculate("12/3")).toBe(4);
  });

  it("should handle parentheses", () => {
    expect(calculator.calculate("(2 + 3) * 4")).toBe(20);
    expect(calculator.calculate("2 * (3 + 4)")).toBe(14);
    expect(calculator.calculate("(2 + 3) * (4 + 5)")).toBe(45);
    expect(calculator.calculate("52.34 - (3 * (4,25 + 5))")).toBe(24.59);
  });

  it("should handle exponents", () => {
    expect(calculator.calculate("2 ^ 3")).toBe(8);
    expect(calculator.calculate("2 ** 3")).toBe(8);
    expect(calculator.calculate("4 ^ 0.5")).toBe(2);
  });

  it("should handle percentages", () => {
    expect(calculator.calculate("10 + 20%")).toBe(12);
    expect(calculator.calculate("100 - 20%")).toBe(80);
    expect(calculator.calculate("10 * 20%")).toBe(2);
    expect(calculator.calculate("100 / 20%")).toBe(500);
  });

  it("should handle min and max values", () => {
    expect(calculator.calculate("-101")).toBe(-100);
    expect(calculator.calculate("501")).toBe(500);
  });

  it("should handle invalid input", () => {
    expect(calculator.calculate("2 + ")).toBeNull();
    expect(calculator.calculate("2 + a")).toBeNull();
  });
});
