#!/usr/bin/env node
/**
 * This is the main calculator engine. It contains all the subroutines that
 * make up the entire calculation process.
 */

// Custom Modules
import { userInfo, paymentOptions, coverType } from '../input_engine.js';
import { memberDetails } from '../member_details.js';
import periodCalculators from './periodCalculators.js';
import calculateMedicalRequirements from './medical_requirements.js';

const constants = {
  /**
   * These are all the constants that are used in the calculation process.
   * They are defined here to make it easier to change them if needed.
   * The constants are used in the calculation process and are not directly
   * used in the output engine.
   */

  year: 365,
  thousandRate: 1000,
  criticalIllnessRiderDiscount: 0.3,
  retrenchmentUnitRate: 1.50,
  lastexpenseUnitRate: 5.50,
  criticalIllnessStandAloneAcceleratedUnitRate: 1.50,
  totalDisabilityoutstandingLoanAmountUnitRate: 0.00,
  deathOutstandingLoanAmountUnitRate: 5.50,
  policyEffectiveDate: '1/1/22',
  illnessRiderConst: 3000000,
  freeCoverLimit: 15000000,
  retRate: 0.00775,
  gcRate: 0.00675,
  discount: 0.7,
  withRETconst() {
    /**
     * This method returns the constant added to the formula for calculating
     * the gross insurance premium for the case of a single but with
     * retrenchment benefits member.
     */

    return (this.retRate - this.gcRate) * userInfo.sumAssured;
  },
};

export default class ProcessingEngine {
  /**
   * The processing engine class calculator.
   */

  constructor() {
    this.userInfo = userInfo;
    this.paymentOptions = paymentOptions;
    this.coverType = coverType;
    this.memberDetails = memberDetails;
  }

  main() {
    /**
     * This method adds the refrenced fields to the memberDetails array for each member.
     * It must be called before they are refrenced.
     */

    this.memberDetails.forEach((member) => {
      member.ANB = periodCalculators.calculateAge(member.DoB);
      member.sumAssuredWithinFCL = Math.min(member.loanAmountOrOSBalance, constants.freeCoverLimit);
      member.sumAssuredAboveFCL = member.fullSumAssured - member.sumAssuredWithinFCL;
      member.noOfDaysOnCover = periodCalculators.calculateLoanDaysOnCover(member.loanIssueDate, member.loanRapaymentPeriodInMonths, constants.policyEffectiveDate);
      member.death = member.fullSumAssured * constants.deathOutstandingLoanAmountUnitRate / constants.thousandRate * member.noOfDaysOnCover / constants.year;
      member.criticalIllnessRider = Math.min((constants.criticalIllnessRiderDiscount * member.fullSumAssured), constants.illnessRiderConst);
      member.medicalLoading = member.sumAssuredAboveFCL * constants.deathOutstandingLoanAmountUnitRate / constants.thousandRate * member.acceptanceTerms/100;
      member.PTD = member.permanentTotalDisability * constants.totalDisabilityoutstandingLoanAmountUnitRate / constants.thousandRate * member.noOfDaysOnCover / constants.year;
      member.criticalIllNess = member.criticalIllnessRider * constants.criticalIllnessStandAloneAcceleratedUnitRate / constants.thousandRate * member.noOfDaysOnCover / constants.year;
      member.funeralExpenseOne = member.lastExpense * constants.lastexpenseUnitRate / constants.thousandRate * member.noOfDaysOnCover / constants.year;
      member.funeralExpenseTwo = member.retrenchment * constants.retrenchmentUnitRate / constants.thousandRate * member.noOfDaysOnCover / constants.year;
      member.totalAnnualPremiums = member.death + member.medicalLoading + member.PTD + member.criticalIllNess + member.funeralExpenseOne + member.funeralExpenseTwo;
      member.medicalRequirements = calculateMedicalRequirements(member.DoB, member.sumAssuredAboveFCL);
    });
  }

  validateNumberInputs() {
    /**
     * This method validates the number inputs.
     */

    let isValid = false;
    if (this.userInfo.sumAssured > 0
      && this.userInfo.termsInMonths > 0
      && !isNaN(this.userInfo.sumAssured)
      && !isNaN(this.userInfo.termsInMonths)) {
      isValid = true;
    }
    return isValid;
  }

  getCoverType() {
    /**
     * This method returns the cover type that should be used to generate the
     * client quotation.
     *
     * @return {string} The cover type. Either 'single' or 'multiple'.
     * 
     * @usage
     * Toggle the value of this.CoverType to either multiple or single.
     */

    return this.coverType.multiple;
  }

  validateDoBs() {
    /**
     * This method validates the length of date of births.
     *
     * @return {boolean} True if the date of births are valid. False otherwise.
     * @usage
     * If you select multiple users, you must provide date of births equivalent
     * to the number of members to insure.
     */

    if (this.getCoverType() === 'multiple') {
      let isValid = false;
      if (this.userInfo.userDateOfBirths.length > 1) {
        isValid = true;
      }
      return isValid;
    } else if (this.getCoverType() === 'single') {
      return true;
    }
  }

  getAge () {
    /**
     * This method returns the age of each member.
     * The age returned is their Age Next Birthday.
     */

    const ages = this.userInfo.userDateOfBirths.map((dob) => periodCalculators.calculateAge(dob));
    return ages;
  }

  verifyAge() {
    /**
     * This methed verifies the age of each member.
     *
     * @return {boolean} True if the age is valid. False otherwise.
     */
    let isValid = false;

    this.getAge().forEach((age) => {
      if (age >= 18 && age <= 70) {
        isValid = true;
      }
    })

    return isValid;
  }

  getRetrechmentCover() {
    /**
     * This method is used to return the retrenchment cover for the client.
     * @usage
     * Toggle the boolean of userInfo.individualRetrenchmentCover in the input_engine.js file
     * to true or false.
     * When it true, the single user has a retrenchment cover, else, he/she doesn't.
     */

    return this.userInfo.individualRetrenchmentCover;
  }

  getFormular() {
    /**
     * This method is used to calculate the gross premium cover.
     * In the case of a single user, the value of N diminishes to zero.
     */
    const coverType = this.getCoverType();
    const [P, T, N] = [
      this.userInfo.sumAssured, this.userInfo.termsInMonths,
      coverType === 'multiple' ? this.userInfo.userDateOfBirths.length : 1,
    ];
    
    const premiumFormular = (constants.gcRate * P * (T / 12))
      + (constants.gcRate * P * (T / 12)
      * constants.discount * (N - 1));

    return premiumFormular;
  }

  premiumCalculator() {
    /**
     * This method is used to calculate the gross insurance premium.
     * It calls the getFormular method to calculate the premium.
     * In case of a single user with retrenchment, we add the withRET() return constant.
     * Else, the formula is the same for both multiple or single user without retrenchment benefit.
     */
    let grossInsurancePremium;

    const coverType = this.getCoverType();
    const retrenchment = this.getRetrechmentCover();

    if (this.verifyAge() && this.validateNumberInputs() && this.validateDoBs()) {
      if (coverType === 'single' && retrenchment) {
        grossInsurancePremium = this.getFormular() + constants.withRETconst();
      } else if (coverType === 'multiple' || coverType === 'single' && !retrenchment) {
        grossInsurancePremium = this.getFormular();
      } else {
        grossInsurancePremium = 0;
      };
    } else {
      throw new Error("Error in inputs")
    };
    return grossInsurancePremium;
  }
}
