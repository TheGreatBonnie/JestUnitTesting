const calculator = require('./calculator');

describe("Calculator tests", () => {
    test('adding 2 + 5 should return 7', () => {
      expect(calculator.addition(2, 5)).toBe(7);
    });

    test('subtracting 4 from 15 should return 11', () => {
        expect(calculator.subtraction(15, 4)).toBe(11);
    });

    test('multiplying 3 and 5 should return 15', () => {
        expect(calculator.multiplication(3, 5)).toBe(15);
    });

    test('dividing 18 by 3 should return 6', () => {
        expect(calculator.division(18, 3)).toBe(6);
    });
})