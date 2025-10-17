export function calculateFutureValue(monthlySaving, monthlyRate, months) {
  return Math.round(
    monthlySaving *
      (((1 + monthlyRate) ** months - 1) / monthlyRate) *
      (1 + monthlyRate)
  );
}

export function calculateElectricityData({
  currentMonthlyBill,
  currentYear,
  currentCharge,
  yoyIncreasePct,
  endYear,
}) {
  const data = {};
  const monthlyKwh = currentMonthlyBill / currentCharge;
  for (let year = currentYear; year <= endYear; year++) {
    const yearsForward = year - currentYear;
    const rawCharge =
      currentCharge * Math.pow(1 + yoyIncreasePct / 100, yearsForward);
    const charge = Number(rawCharge.toFixed(2));
    const rawAnnualBill = monthlyKwh * rawCharge * 12;
    const annualBill = Math.round(rawAnnualBill);
    data[year] = { charge, annualBill };
  }
  return data;
}

export function calculateBills(tariffsByYear, unitsPerMonth) {
  const unitsPerYear = unitsPerMonth * 12;

  return tariffsByYear.map(({ year, tariff }) => {
    const monthlyBill = Math.floor(unitsPerMonth * tariff);
    const yearlyBill = Math.floor(monthlyBill * 12);
    return {
      year,
      tariff,
      unitsPerMonth,
      monthlyBill,
      unitsPerYear,
      yearlyBill,
    };
  });
}

export function calculateTariffs(
  startYear,
  initialTariff,
  yoy,
  years,
  direction = "forward"
) {
  const result = [];
  let currTariff = initialTariff;
  const step = direction === "forward" ? 1 : -1;

  for (let i = 0; i <= years; i++) {
    if (direction === "backward" && i !== 0) {
      currTariff /= 1 + yoy / 100;
    }

    if (direction === "forward" && i !== 0) {
      currTariff *= 1 + yoy / 100;
    }

    if (i !== 0 || direction === "forward") {
      result.push({
        year: startYear + i * step,
        tariff: parseFloat(currTariff.toFixed(2)),
      });
    }
  }

  return result;
}

export function filterBillingDataByYear(data, options = {}) {
  const currentYear = new Date().getFullYear();
  const { fromYear, toYear, mode = "between", gap = 1 } = options;

  const start = fromYear ?? currentYear;
  const end = toYear ?? currentYear;

  return data.filter((item) => {
    const year = item.year;

    if (mode === "after") {
      if (year < start) return false;
    }

    if (mode === "before") {
      if (year > end) return false;
    }

    if (mode === "between") {
      if (year < start || year > end) return false;
    }

    if (gap > 1) {
      const relativeStart = mode === "before" ? end : start;
      if ((year - relativeStart) % gap !== 0) return false;
    }

    return true;
  });
}

// const result = filterBillingDataByYear(billingByYear, {
//   mode: "after",
//   gap: 5
// });

// const result = filterBillingDataByYear(billingByYear, {
//   mode: "before",
//   gap: 5
// });

// const result = filterBillingDataByYear(billingByYear, {
//   mode: "between",
//   fromYear: 2020,
//   toYear: 2050,
//   gap: 10
// });

export function averageByYearRange(data, fromYear, toYear, key) {
  const filtered = data.filter(
    (item) =>
      item.year >= fromYear &&
      item.year <= toYear &&
      typeof item[key] === "number"
  );
  if (filtered.length === 0) return 0;
  const sum = filtered.reduce((acc, item) => acc + item[key], 0);
  return Math.floor(sum / filtered.length);
}
