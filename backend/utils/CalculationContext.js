import {
  getStateFromPincode,
  getTariffForState,
  calculateMonthlyBill,
  getYOYIncrease,
  unitsConsumedPerMonth,
  getDistrictNameFromPincode,
  getUnitsPerMonth,
  getStateSubsidy,
  getTotalSubsidy,
  getPolicyScore,
  getCapacityOfOnePanel,
  truncateDecimals,
  getAverageSolarGeneration,
  getmaintenanceCostINR,
  getco2Emission,
  getAverageTreeAbsorbs,
  getinsuranceCostInPercent,
  getinsuranceYOYescalation,
  getAnnualBillWithSolar,
  getYoyDegradation,
  getAssumedGHIirradiation,
  getAMCyoy,
  getAMCyoyEscalation,
  getAreaAverageConsumption,
  getProjectYOYdegradation,
  getYear1Degradation,
} from "../utils/electricityHelpers.js";

class CalculationContext {
  constructor(input) {
    // User Inputs
    this.name = input.name || null;
    this.email = input.userEmail || null;
    this.userPhone = input.userPhone || null;
    this.address = input.address || null;
    this.pincode = input.pincode || null;
    this.roofArea = input.roofArea || null;
    this.billType = input.billType || null;
    this.billAmount = input.billAmount || null;
    this.consumptionUnits = input.consumptionUnits || null;
    this.moreInfo = input.moreInfo || null;
    this.followUp = input.followUp || null;
    this.bill = input.bill || null;
    this.location = input.location || null;

    // Calculated/DB/Result Variables (all set to null/default)
    this.statename = null;
    this.highestTariff = null;
    this.monthlyBill = null;
    this.annualBill = null;
    this.monthlyConsuptionunitsKwh = null;
    this.annualConsuptionunitsKwh = null;
    this.districtName = null;
    this.stateSubsidy = null;
    this.totalSubsidy = null;
    this.yoy = null;
    this.CapacityOfOnePanel = null;
    this.numberOfUnits1KwhPerMonth = null;
    this.policyScore = null;
    this.capacityOfSolarSystemRequiredKw = null;
    this.AverageSolarGeneration = null;
    this.maintenanceCostINR = null;
    this.co2Emission = null;
    this.averageTreeAbsorbs = null;
    this.insuranceCost = null;
    this.insuranceYOYescalation = null;
    this.annualBillWithSolar = null;
    this.AverageSolarGeneration = null;
    this.yoyDegradation = null;
    this.assumedGhiIrradiation = null;
    this.amcYoy = null;
    this.amcYoyEscalation = null;
    this.getAreaAverage = null;
    this.ProjectYOYdegradation = null;
    this.year1Degradation = null;
  }

  async init() {
    this.currentyear = new Date().getFullYear(); // get current year
    this.yoy = await getYOYIncrease(); // get yoy increase from db
    this.CapacityOfOnePanel = await getCapacityOfOnePanel(); // get getCapacityOfOnePanel from db
    this.numberOfUnits1KwhPerMonth = await getUnitsPerMonth(); // get units per month which is 120 from db
    this.AverageSolarGeneration = await getAverageSolarGeneration(); // get average solar generation from db
    this.maintenanceCostINR = await getmaintenanceCostINR(); // get maintenance cost in from db
    this.co2Emission = await getco2Emission(); // get co2 emission from db
    this.averageTreeAbsorbs = await getAverageTreeAbsorbs(); // get average tree absorbs from db
    this.insuranceCost = await getinsuranceCostInPercent(); // get insurance cost in percent from db
    this.insuranceYOYescalation = await getinsuranceYOYescalation(); // get insurance yoy escalation from db
    this.annualBillWithSolar = await getAnnualBillWithSolar(); // get annual bill with solar from db
    this.yoyDegradation = await getYoyDegradation(); // get yoy degradation from db
    this.assumedGhiIrradiation = await getAssumedGHIirradiation(); // get assumed ghi irradiation from db
    this.amcYoy = await getAMCyoy(); // get amc yoy from db
    this.amcYoyEscalation = await getAMCyoyEscalation(); // get amc yoy escalation from db
    this.ProjectYOYdegradation = await getProjectYOYdegradation(); // get amc yoy escalation from db
    this.getAreaAverage = await getAreaAverageConsumption(); // get area average consumption from db
    this.year1Degradation = await getYear1Degradation(); // get area average consumption from db

    this.statename = await getStateFromPincode(this.pincode);
    this.highestTariff = await getTariffForState(this.statename);
    this.monthlyBill = calculateMonthlyBill(
      this.billAmount,
      this.consumptionUnits,
      this.highestTariff
    );
    this.annualBill = this.monthlyBill * 12;
    this.monthlyConsuptionunitsKwh = unitsConsumedPerMonth(
      this.billAmount,
      this.consumptionUnits,
      this.highestTariff
    );
    this.annualConsuptionunitsKwh = Math.round(
      this.monthlyConsuptionunitsKwh * 12
    );
    this.averageConsumptionPerMonth = Math.round(
      this.monthlyBill / this.highestTariff
    );
    this.districtName = await getDistrictNameFromPincode(this.pincode);
    this.stateSubsidy = Number(await getStateSubsidy(this.statename));
    this.totalSubsidy = await getTotalSubsidy(this.statename);
    this.policyScore = await getPolicyScore(this.statename);
    this.capacityOfSolarSystemRequiredKw = truncateDecimals(
      this.monthlyConsuptionunitsKwh / this.numberOfUnits1KwhPerMonth
    );
    this.AverageSolarGeneration = this.numberOfUnits1KwhPerMonth / 30;
    return this;
  }
}

export default CalculationContext;
