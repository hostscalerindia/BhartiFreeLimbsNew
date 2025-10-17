import AppConfig from "../models/AppConfig.js";
import TariffTable from "../models/StateElectricityTariffsTable.js";
import PincodeTable from "../models/PincodeStateMap.js";
import solarSubsidyTable from "../models/SolarSubsidySchema.js";

// Get state name from pincode
export const getStateFromPincode = async (pincode) => {
  const pincodeDoc = await PincodeTable.findOne({ pincode: pincode.trim() });
  if (!pincodeDoc || !pincodeDoc.statename) {
    throw new Error("State not found for this pincode");
  }
  return pincodeDoc.statename;
};

export const getDistrictNameFromPincode = async (pincode) => {
  const pincodeDoc = await PincodeTable.findOne({
    pincode: pincode.toString().trim(),
  });
  if (!pincodeDoc || !pincodeDoc.district) {
    throw new Error("District not found for this pincode");
  }
  return pincodeDoc.district.trim().toLowerCase();
};

export const getStateSubsidy = async (rawStateName) => {
  const stateName = rawStateName.trim();
  const solarDoc = await solarSubsidyTable.findOne({
    state: { $regex: `^${stateName}$`, $options: "i" },
  });
  if (!solarDoc) {
    throw new Error(`State subsidy not found for state: ${stateName}`);
  }
  return solarDoc.state_subsidy;
};

export const getTotalSubsidy = async (rawStateName) => {
  const stateName = rawStateName.trim();
  const solarDoc = await solarSubsidyTable.findOne({
    state: { $regex: `^${stateName}$`, $options: "i" },
  });
  if (!solarDoc) {
    throw new Error(`Total subsidy not found for state: ${stateName}`);
  }
  return solarDoc.total_subsidy;
};

export const getPolicyScore = async (rawStateName) => {
  const stateName = rawStateName.trim();
  const solarDoc = await solarSubsidyTable.findOne({
    state: { $regex: `^${stateName}$`, $options: "i" },
  });

  if (!solarDoc) {
    throw new Error(`Policy score not found for state: ${stateName}`);
  }
  return solarDoc.policy_score;
};

// Get Highest Tariff using statename
export const getTariffForState = async (stateName) => {
  const stateTariff = await TariffTable.findOne({
    state: new RegExp(`^${stateName}$`, "i"),
  });
  if (!stateTariff || !stateTariff.highestTariffSlab) {
    throw new Error("Tariff not found for this state");
  }
  return parseFloat(stateTariff.highestTariffSlab);
};

// Get YOY increase %
export const getYOYIncrease = async () => {
  const config = await AppConfig.findOne({ key: "yoy" });
  return parseFloat(config?.value) || 4;
};

export const getAreaAverageConsumption = async () => {
  const config = await AppConfig.findOne({ key: "AreaAverageConsumption" });
  return parseFloat(config?.value) || 300;
};

export const getco2Emission = async () => {
  const config = await AppConfig.findOne({ key: "co2Emission" });
  return parseFloat(config?.value) || 0.82;
};

export const getAverageTreeAbsorbs = async () => {
  const config = await AppConfig.findOne({ key: "averageTreeAbsorbs" });
  return parseFloat(config?.value) || 20;
};

export const getAverageSolarGeneration = async () => {
  const config = await AppConfig.findOne({ key: "AverageSolarGeneration" });
  return parseFloat(config?.value);
};

export const getUnitsPerMonth = async () => {
  const config = await AppConfig.findOne({ key: "unitsPerMonth" });
  return parseFloat(config?.value);
};

export const getYoyDegradation = async () => {
  const config = await AppConfig.findOne({ key: "yoyDegradation" });
  return parseFloat(config?.value);
};

export const getAssumedGHIirradiation = async () => {
  const config = await AppConfig.findOne({ key: "assumedGHIirradiation" });
  return parseFloat(config?.value);
};

export const getAMCyoy = async () => {
  const config = await AppConfig.findOne({ key: "AMCyoy" });
  return parseFloat(config?.value);
};

export const getProjectYOYdegradation = async () => {
  const config = await AppConfig.findOne({ key: "projectYOYdegradation" });
  return parseFloat(config?.value);
};

export const getYear1Degradation = async () => {
  const config = await AppConfig.findOne({ key: "year1degradation" });
  return parseFloat(config?.value);
};

export const getAMCyoyEscalation = async () => {
  const config = await AppConfig.findOne({ key: "AMCyoyEscalation" });
  return parseFloat(config?.value);
};

export const getInsuranceCostInPercent = async () => {
  const config = await AppConfig.findOne({ key: "insuranceCostInPercent" });
  return parseFloat(config?.value);
};

export const getinsuranceYOYescalation = async () => {
  const config = await AppConfig.findOne({ key: "insuranceYOYescalation" });
  return parseFloat(config?.value);
};

export const getCapacityOfOnePanel = async () => {
  const config = await AppConfig.findOne({ key: "capacityOfOnePanel" });
  return parseFloat(config?.value) || 550;
};

export const getInverterCost = async () => {
  const config = await AppConfig.findOne({ key: "inverterCost" });
  return parseFloat(config?.value) || 0;
};

export const getmaintenanceCostINR = async () => {
  const config = await AppConfig.findOne({ key: "maintenanceCostINR" });
  return parseFloat(config?.value);
};

export const getinsuranceCostInPercent = async () => {
  const config = await AppConfig.findOne({ key: "insuranceCostInPercent" });
  return parseFloat(config?.value);
};

export const getAnnualBillWithSolar = async () => {
  const config = await AppConfig.findOne({ key: "AnnualBillWithSolar" });
  return parseFloat(config?.value);
};

// Calculate monthly bill
export const calculateMonthlyBill = (
  billAmount,
  consumptionUnits,
  highestStateTariff
) => {
  if (billAmount !== undefined && billAmount !== null && billAmount !== "") {
    return parseFloat(billAmount);
  }
  return Number(consumptionUnits) * Number(highestStateTariff);
};

// Calculate total annual bill sum
export const getTotalAnnualBill = (data) => {
  return Object.values(data).reduce((sum, item) => sum + item.annualBill, 0);
};

export const getTotalLifeTimeSavings = (data) => {
  return Object.values(data).reduce(
    (sum, item) => sum + item.lifetimeSaving,
    0
  );
};

// Calculate units consumed per month (kwh)
export const unitsConsumedPerMonth = (
  billAmount,
  consumptionUnits,
  highestStateTariff
) => {
  if (
    consumptionUnits !== undefined &&
    consumptionUnits !== null &&
    consumptionUnits !== ""
  ) {
    return Number(consumptionUnits);
  }
  const finalValue = Math.round(
    Number(billAmount) / Number(highestStateTariff)
  );
  return finalValue;
};

export const sumAnnualBillsFrom = (
  billingByYear,
  currentYear,
  includeCurrent = true
) => {
  const comparator = includeCurrent
    ? (y) => y >= currentYear // 2025, 2026, 2027…
    : (y) => y > currentYear; // 2026, 2027 …

  return billingByYear
    .filter(({ year }) => comparator(year))
    .reduce((acc, { yearlyBill }) => acc + yearlyBill, 0);
};

export const truncateDecimals = (num, digits = 2) => {
  const factor = 10 ** digits;
  return (
    (num >= 0 ? Math.floor(num * factor) : Math.ceil(num * factor)) / factor
  );
};

export const calculateFutureTariffs = (
  currentyear,
  highestStateTariff,
  yoy,
  years
) => {
  const result = [];

  // current year itself
  result.push({
    year: currentyear,
    tariff: parseFloat(highestStateTariff.toFixed(2)),
  });

  // future years
  let currTariff = highestStateTariff;
  for (let i = 1; i <= years; i++) {
    currTariff *= 1 + yoy / 100;
    result.push({
      year: currentyear + i,
      tariff: parseFloat(currTariff.toFixed(2)),
    });
  }

  return result;
};

export const calculatePastTariffs = (
  currentyear,
  highestStateTariff,
  yoy,
  years
) => {
  const result = [];
  let currTariff = highestStateTariff;

  for (let i = 1; i <= years; i++) {
    const year = currentyear - i;
    currTariff = currTariff / (1 + yoy / 100);
    result.push({
      year,
      tariff: parseFloat((Math.round(currTariff * 100) / 100).toFixed(2)),
    });
  }

  return result;
};

export const calculateBills = (tariffsByYear, unitsPerMonth) => {
  return tariffsByYear.map(({ year, tariff }) => {
    const monthlyBill = Math.floor(unitsPerMonth * tariff);
    const unitsPerYear = unitsPerMonth * 12;
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
};

export const getLast10Years = (currentYear, highestStateTariff, yoy) =>
  calculatePastTariffs(currentYear, highestStateTariff, yoy, 11);

// Returns the next 25 years of tariffs (starting from current year)
export const getNext25Years = (currentYear, highestStateTariff, yoy) =>
  calculateFutureTariffs(currentYear, highestStateTariff, yoy, 25);

export const getAllTariffsByYear = (currentYear, highestStateTariff, yoy) => {
  const last10year = getLast10Years(currentYear, highestStateTariff, yoy);
  const next25year = getNext25Years(currentYear, highestStateTariff, yoy);

  return [...last10year, ...next25year].sort((a, b) => a.year - b.year);
};

// const last10year = getLast10Years(currentYear, highestStateTariff, yoy);
// const next25year = getNext25Years(currentYear, highestStateTariff, yoy);
//  const allTariffsByYear = getAllTariffsByYear(
//   currentYear,
//   highestStateTariff,
//   yoy
// );

// Extracting annualBill from currentYear ----> named as BeforeSolar in Kpi-9
export const extractBeforeSolarArray = (billingByYear, currentYear) =>
  billingByYear
    .filter(({ year }) => year >= currentYear)
    .map(({ year, yearlyBill }) => ({
      year,
      BeforeSolar: yearlyBill,
    }));
