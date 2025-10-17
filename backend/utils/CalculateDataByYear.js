export const AnnualDegradationTable = ({
  annualConsumptionUnitsKwh,
  currentYear,
  stopYear,
  yearDegradationPercent = 2,
  yoyDegradationPercent = 0.0055,
  co2EmissionFactor = 0.82,
}) => {

  if (
    typeof annualConsumptionUnitsKwh !== "number" ||
    isNaN(annualConsumptionUnitsKwh)
  ) {
    throw new Error("annualConsumptionUnitsKwh is missing or invalid");
  }

  const result = [];

  for (let i = 0; i <= stopYear; i++) {
    const year = currentYear + i;
    let value;

    if (i === 0 || i === 1) {
      value = annualConsumptionUnitsKwh;
    } else if (i === 2) {
      const fixedDegradation = yearDegradationPercent / 100;
      value = annualConsumptionUnitsKwh * (1 - fixedDegradation);
    } else {
      const fixedDegradation = yearDegradationPercent / 100;
      const totalDegradation = fixedDegradation + i * yoyDegradationPercent;
      const factor = 1 - totalDegradation;
      value = annualConsumptionUnitsKwh * factor;
    }
    if (value === undefined) {
      console.error("Value is undefined at index", i);
    }

    const annualDegradation = Number(value.toFixed(0));
    const annualCO2OffsetKg = Number(
      (annualDegradation * co2EmissionFactor).toFixed(0)
    );

    let cumulativeCO2;
    if (i === 0) {
      cumulativeCO2 = annualCO2OffsetKg;
    } else {
      const prev = result[i - 1];
      cumulativeCO2 = prev.cumulativeCO2OffsetKg + prev.annualCO2OffsetKg;
    }

    result.push({
      index: i,
      year,
      annualDegradation,
      annualCO2OffsetKg,
      cumulativeCO2OffsetKg: cumulativeCO2,
    });
  }

  // ⬇ return both the full array and the final year's cumulative CO2
  return {
    // data: result,
    finalCumulativeCO2OffsetKg: result[result.length - 1].cumulativeCO2OffsetKg,
  };
};
