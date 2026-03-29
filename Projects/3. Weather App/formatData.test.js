import { formatTemp, getAirQualityLabel, calcChanceOfRain } from "./js/utils/formatData.js";

// Test 1 — formatTemp returns celsius correctly
test("formatTemp returns celsius string in metric", () => {
    expect(formatTemp(21.7, 71.06, "metric")).toBe("22°C");
});

// Test 2 — getAirQualityLabel returns correct band
test("getAirQualityLabel returns Low for index 2", () => {
    expect(getAirQualityLabel(2)).toBe("2 (Low)");
});

// Test 3 — calcChanceOfRain rounds to nearest 10
test("calcChanceOfRain rounds 36 up to 40%", () => {
    expect(calcChanceOfRain(36)).toBe("40%");
});