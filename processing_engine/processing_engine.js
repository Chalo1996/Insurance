/**
 * This is the main calculator engine. It contains all the subroutines that
 * make up the entire calculation process.
 */

// Custom Modules
import periodCalculators from './Calculators.js';
import calculateMedicalRequirements from './medical_requirements.js';
import constants from '../constants.js';

const calculateGroupCreditPremiumFixedRating = (userInfo = {}, paymentOptions = {}, coverType = {}, memberDetails = {}) => {
  const covertype = coverType.single;
  let grossInsurancePremium;
  const retrenchment = userInfo.individualRetrenchmentCover;

  const validateNumberInputs = () => {
    /**
     * This method validates the number inputs.
     */

    let isValid = false;
    if (
      userInfo.sumAssured > 0 &&
      userInfo.termsInMonths > 0 &&
      !isNaN(userInfo.sumAssured) &&
      !isNaN(userInfo.termsInMonths)
    ) {
      isValid = true;
    }
    return isValid;
  };

  const getAge = () => {
    /**
     * This method returns the age of each member.
     * The age returned is their Age Next Birthday.
     */

    const ages = userInfo.userDateOfBirths.map((dob) =>
      periodCalculators.calculateAge(dob)
    );
    return ages;
  };

  const verifyAge = () => {
    /**
     * This methed verifies the age of each member.
     *
     * @return {boolean} True if the age is valid. False otherwise.
     */
    let isValid = false;

    getAge().forEach((age) => {
      if (age >= 18 && age <= 70) {
        isValid = true;
      }
    });

    return isValid;
  };

  const getFormular = () => {
    /**
     * This method is used to calculate the gross premium cover.
     * In the case of a single user, the value of N diminishes to zero.
     */

    const [P, T, N] = [
      userInfo.sumAssured,
      userInfo.termsInMonths,
      covertype === 'multiple'
        ? userInfo.userDateOfBirths.length
        : 1,
    ];

    const premiumFormular =
      constants.gcRate * P * (T / 12) +
      constants.gcRate * P * (T / 12) * constants.discount * (N - 1);

    return premiumFormular;
  };

  const validateDoBsLen = () => {
    /**
     * This method validates the length of date of births.
     *
     * @return {boolean} True if the date of births are valid. False otherwise.
     * @usage
     * If you select multiple users, you must provide date of births equivalent
     * to the number of members to insure.
     */

    if (covertype === 'multiple') {
      let isValid = false;
      if (userInfo.userDateOfBirths.length > 1) {
        isValid = true;
      }
      return isValid;
    } else if (covertype === 'single') {
      return true;
    }
  };

  // This method adds the refrenced fields to the memberDetails array for each member.
  // It must be called before they are refrenced.
  const ages = userInfo.userDateOfBirths.map((dob) =>
    periodCalculators.calculateAge(dob)
  );

  memberDetails.forEach((member) => {
    member.ANB = periodCalculators.calculateAge(member.DoB);
    member.sumAssuredWithinFCL = Math.min(
      member.loanAmountOrOSBalance,
      constants.freeCoverLimit
    );
    member.sumAssuredAboveFCL =
      member.fullSumAssured - member.sumAssuredWithinFCL;
    member.noOfDaysOnCover = periodCalculators.calculateLoanDaysOnCover(
      member.loanIssueDate,
      member.loanRapaymentPeriodInMonths,
      constants.policyEffectiveDate
    );
    member.death =
      (member.fullSumAssured *
        constants.deathOutstandingLoanAmountUnitRate *
        member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year);
    member.criticalIllnessRider = Math.min(
      constants.criticalIllnessRiderDiscount * member.fullSumAssured,
      constants.illnessRiderConst
    );
    member.medicalLoading =
      (member.sumAssuredAboveFCL *
        constants.deathOutstandingLoanAmountUnitRate *
        member.acceptanceTerms) /
      (constants.thousandRate * 100);
    member.PTD =
      (member.permanentTotalDisability *
        constants.totalDisabilityoutstandingLoanAmountUnitRate *
        member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year);
    member.criticalIllNess =
      (member.criticalIllnessRider *
        constants.criticalIllnessStandAloneAcceleratedUnitRate *
        member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year);
    member.funeralExpenseOne =
      (member.lastExpense *
        constants.lastexpenseUnitRate *
        member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year);
    member.funeralExpenseTwo =
      (member.retrenchment *
        constants.retrenchmentUnitRate *
        member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year);
    member.totalAnnualPremiums =
      member.death +
      member.medicalLoading +
      member.PTD +
      member.criticalIllNess +
      member.funeralExpenseOne +
      member.funeralExpenseTwo;
    member.medicalRequirements = calculateMedicalRequirements(
      member.DoB,
      member.sumAssuredAboveFCL
    );
  });

  if (verifyAge() && validateNumberInputs() && validateDoBsLen()) {
    if (covertype === 'single' && retrenchment) {
      grossInsurancePremium = getFormular() + constants.withRETconst();
    } else if (covertype === 'multiple' || (covertype === 'single' && !retrenchment)) {
      grossInsurancePremium = getFormular();
    } else {
      grossInsurancePremium = 0;
    }
  } else {
    throw new Error('Error in inputs');
  }

  return grossInsurancePremium;
};

export default calculateGroupCreditPremiumFixedRating;
