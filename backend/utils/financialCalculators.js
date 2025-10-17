import { getAMCyoy, truncateDecimals } from "./electricityHelpers.js";

export function calculateReverseValuesJSON({
  currentYear,
  baseAmount,
  yearsBack = 5,
  annualIncreasePct = 4,
}) {
  const values = {};
  const futureYear = currentYear + yearsBack;
  let currentAmount = baseAmount;

  for (let year = futureYear; year >= currentYear; year--) {
    values[year] = Math.round(currentAmount);
    currentAmount = currentAmount / (1 + annualIncreasePct / 100);
  }
  return values;
}

export const calculateMaintenanceByYear = async ({
  currentYear,
  monthlyConsumptionKwh,
  unitsPerMonth,
  yearsForward = 25,
}) => {
  const AMCyoy = await getAMCyoy();
  const maintenanceCost = AMCyoy;
  const systemSizeKwh = truncateDecimals(monthlyConsumptionKwh / unitsPerMonth);
  const maintenanceData = [];

  const ratePerKwPerYear = {};

  ratePerKwPerYear[currentYear + 5] = maintenanceCost;

  for (let year = currentYear + 4; year >= currentYear; year--) {
    ratePerKwPerYear[year] = ratePerKwPerYear[year + 1] / (1 + 4 / 100);
  }

  console.log(ratePerKwPerYear);

  let previousMaintenanceCost = 0;

  for (let year = currentYear; year <= currentYear + yearsForward; year++) {
    let maintenanceCostForYear;

    if (year === currentYear) {
      maintenanceCostForYear = 0;
    } else if (year < currentYear + 5) {
      maintenanceCostForYear = previousMaintenanceCost * (1 + 4 / 100);
    } else if (year === currentYear + 5) {
      maintenanceCostForYear = ratePerKwPerYear[year] * systemSizeKwh;
    } else {
      maintenanceCostForYear = previousMaintenanceCost * (1 + 4 / 100);
    }

    maintenanceData.push({
      year: year,
      maintenanceCost: Math.round(maintenanceCostForYear),
    });

    previousMaintenanceCost = maintenanceCostForYear;
  }
  

  return maintenanceData;
};

export const calculateInsuranceCosts = ({
  currentYear,
  initialInvestment,
  insuranceCost,
  insuranceYOYescalation,
  yearsForward = 25,
}) => {
  const insurance = [];
  let previousInsuranceCost = 0;

  for (let year = currentYear; year <= currentYear + yearsForward; year++) {
    let insuranceCostForYear;

    if (year === currentYear) {
      insuranceCostForYear = 0;
    } else if (year === currentYear + 1) {
      insuranceCostForYear = initialInvestment * (insuranceCost / 100);
    } else {
      insuranceCostForYear =
        previousInsuranceCost * (1 + insuranceYOYescalation);
    }

    insurance.push({
      year,
      insuranceCost: Number(Math.round(insuranceCostForYear)),
    });

    previousInsuranceCost = insuranceCostForYear;
  }

  return insurance;
};

export function calculateFullMaintenanceCosts({
  currentYear,
  yearsForward = 25,
  maintenanceCostINR,
  yoy,
  monthlyConsuptionunitsKwh,
}) {
  const maintenance = {};
  const reverseValues = calculateReverseValuesJSON({
    currentYear,
    baseAmount: maintenanceCostINR,
    yearsBack: 5,
    annualIncreasePct: yoy,
  });

  for (let year = currentYear; year <= currentYear + yearsForward; year++) {
    if (year < currentYear + 5) {
      maintenance[year] = 0;
    } else if (year === currentYear + 5) {
      maintenance[year] = Math.round(
        reverseValues[year] * monthlyConsuptionunitsKwh
      );
    } else {
      const prev = maintenance[year - 1];
      maintenance[year] = Math.round(prev * (1 + yoy / 100));
    }
  }

  const maintenanceArray = Object.entries(maintenance).map(([year, value]) => ({
    year: Number(year),
    value,
  }));

  return maintenanceArray;
}


export const GetCalculateRatePerKw = async (currentyear) => {
  const AMCyoy = await getAMCyoy();
  const maintenanceCost = AMCyoy;

  const ratePerKwPerYear = {};

  ratePerKwPerYear[currentyear + 5] = maintenanceCost;

  for (let year = currentyear + 4; year >= currentyear; year--) {
    ratePerKwPerYear[year] = ratePerKwPerYear[year + 1] / (1 + 4 / 100);
  }
  
  return ratePerKwPerYear;
};