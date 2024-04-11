//block

/**
 * @name M3TrainingGroupCreditFixedRating
 * @version 1
 * @author Emmanuel Chalo <emmanuel.chalo@equitybank.co.ke>
 * @description: Commands for calculating various benefits and total premiums payable for group credit fixed rating.
 * @category View
 * @createDate 02-4-2024
 * @lastEdition 03-4-2024
 * @chain M3TrainingGroupCreditFixedRating
 * @lastEditionBy Emmanuel Chalo
 * History
 *
 */

// return context;

const constants = {
  year: 365,
  thousandRate: 1000,
  criticalIllnessRiderDiscount: 0.3,
  retrenchmentUnitRate: 1.5,
  lastexpenseUnitRate: 5.5,
  criticalIllnessStandAloneAcceleratedUnitRate: 1.5,
  totalDisabilityoutstandingLoanAmountUnitRate: 0.0,
  deathOutstandingLoanAmountUnitRate: 5.5,
  policyEffectiveDate: '1/1/22',
  illnessRiderConst: 3000000,
  freeCoverLimit: 15000000,
  retRate: 0.00775,
  gcRate: 0.00675,
  discount: 0.7,
};

const userInfo = _userInfo;
const memberDetails = _memberDetails;
const frequency = userInfo.frequency;
const numOfPremiumInstallments = userInfo.numOfPremiumInstallments;

const medicalRequirementsChoices = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  HIV: 'HIV',
  NONE: 'NONE',
};

// Calculates ANB -> Age Next Birthday
const calculateAge = (dob) => {
  if (!dob) return '';
  if (typeof dob !== 'string' || !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dob)) {
    throw new Error(
      'Invalid date format. Please provide date in MM/DD/YYYY format.',
    );
  }

  const dobDate = new Date(dob);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dobDate.getFullYear();
  const monthDifference = currentDate.getMonth() - dobDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < dobDate.getDate())
  ) {
    age--;
  }

  // ANB -> Age Next Birthday
  return age + 1;
};

// Calculates Loan Due Date in Days for Each Individual
const calculateLoanDaysOnCover = (
  issueDate,
  repaymentPeriod,
  effectiveDate,
) => {
  const issueDateTime = new Date(issueDate);
  const effectiveDateTime = new Date(effectiveDate);

  const adjustedDate = new Date(
    issueDateTime.getFullYear(),
    issueDateTime.getMonth() + repaymentPeriod,
    issueDateTime.getDate() - 1,
  );

  // Number of milliseconds in a day
  const oneDay = 1000 * 60 * 60 * 24;

  // Number of days on cover
  const loanDaysOnCover = Math.ceil(
    (adjustedDate - effectiveDateTime) / oneDay,
  );

  return loanDaysOnCover;
};

const covertype = userInfo.coverType;
let grossInsurancePremium;
const retrenchment =
  userInfo.individualRetrenchmentCover === 'Yes' ? true : false;

const validateNumberInputs = () => {
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
  const ages = userInfo.userDateOfBirths.map((dob) => calculateAge(dob));
  return ages;
};

const verifyAge = () => {
  let isValid = false;
  getAge().forEach((age) => {
    if (age >= 18 && age <= 70) {
      isValid = true;
    }
  });
  return isValid;
};

const validateDoBsLen = () => {
  if (covertype === 'Multiple Individuals & Partnerships') {
    let isValid = false;
    if (userInfo.userDateOfBirths.length > 1) {
      isValid = true;
    }
    return isValid;
  } else if (covertype === 'Single Individuals & Sole Proprietorships') {
    return true;
  }
};

const [P, T, N] = [
  userInfo.sumAssured,
  userInfo.termsInMonths,
  covertype === 'Multiple Individuals & Partnerships'
    ? userInfo.userDateOfBirths.length
    : 1,
];

const premiumFormular =
  constants.gcRate * P * (T / 12) +
  constants.gcRate * P * (T / 12) * constants.discount * (N - 1);

// Rounding function to zero decimal places (nearest integer)
const roundToZeroDecimalPlaces = (value) => {
  return Math.round(value);
};

memberDetails.forEach((member) => {
  member.ANB = calculateAge(member.DoB);
  member.sumAssuredWithinFCL = roundToZeroDecimalPlaces(
    Math.min(member.loanAmountOrOSBalance, constants.freeCoverLimit),
  );
  member.sumAssuredAboveFCL = roundToZeroDecimalPlaces(
    member.fullSumAssured - member.sumAssuredWithinFCL,
  );
  member.noOfDaysOnCover = roundToZeroDecimalPlaces(
    calculateLoanDaysOnCover(
      member.loanIssueDate,
      member.loanRepaymentPeriodInMonths,
      constants.policyEffectiveDate,
    ),
  );
  member.death = roundToZeroDecimalPlaces(
    (member.fullSumAssured *
      constants.deathOutstandingLoanAmountUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year),
  );
  member.criticalIllnessRider = roundToZeroDecimalPlaces(
    Math.min(
      constants.criticalIllnessRiderDiscount * member.fullSumAssured,
      constants.illnessRiderConst,
    ),
  );
  member.medicalLoading = roundToZeroDecimalPlaces(
    (member.sumAssuredAboveFCL *
      constants.deathOutstandingLoanAmountUnitRate *
      member.acceptanceTerms) /
      (constants.thousandRate * 100),
  );
  member.PTD = roundToZeroDecimalPlaces(
    (member.permanentTotalDisability *
      constants.totalDisabilityoutstandingLoanAmountUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year),
  );
  member.criticalIllNess = roundToZeroDecimalPlaces(
    (member.criticalIllnessRider *
      constants.criticalIllnessStandAloneAcceleratedUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year),
  );
  member.funeralExpenseOne = roundToZeroDecimalPlaces(
    (member.lastExpense *
      constants.lastexpenseUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year),
  );
  member.funeralExpenseTwo = roundToZeroDecimalPlaces(
    (member.retrenchment *
      constants.retrenchmentUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year),
  );
  member.totalAnnualPremiums = roundToZeroDecimalPlaces(
    member.death +
      member.medicalLoading +
      member.PTD +
      member.criticalIllNess +
      member.funeralExpenseOne +
      member.funeralExpenseTwo,
  );
});

let annualPremiumsPayable = 0;
const age = getAge();
const termsInYears = roundToZeroDecimalPlaces(userInfo.termsInMonths / 12);

if (verifyAge() && validateNumberInputs() && validateDoBsLen()) {
  if (
    covertype === 'Single Individuals & Sole Proprietorships' &&
    retrenchment
  ) {
    grossInsurancePremium =
      premiumFormular +
      (constants.retRate - constants.gcRate) * userInfo.sumAssured;
  } else if (
    covertype === 'Multiple Individuals & Partnerships' ||
    (covertype === 'Single Individuals & Sole Proprietorships' && !retrenchment)
  ) {
    grossInsurancePremium = premiumFormular;
  } else {
    grossInsurancePremium = 0;
  }
} else {
  throw new Error('Error in inputs');
}

annualPremiumsPayable = roundToZeroDecimalPlaces(
  grossInsurancePremium / numOfPremiumInstallments,
);

memberDetails.forEach((member) => {
  member.medicalRequirements = medicalRequirementsChoices.NONE;
  const age = calculateAge(member.DoB);

  if (age === null || age === '') {
    if (member.sumAssuredAboveFCL > 5000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.F}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 4000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 3000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 2000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 0) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}`;
    } else {
      member.medicalRequirements = medicalRequirementsChoices.NONE;
    }
  } else if (age > 45) {
    if (member.sumAssuredAboveFCL > 5000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.F}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 4000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 3000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 2000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 0) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}`;
    } else {
      member.medicalRequirements = medicalRequirementsChoices.NONE;
    }
  } else {
    if (member.sumAssuredAboveFCL > 5000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.F}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 4000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 3000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 2000000) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.HIV}`;
    } else if (member.sumAssuredAboveFCL > 0) {
      member.medicalRequirements = `${medicalRequirementsChoices.B}`;
    } else {
      member.medicalRequirements = medicalRequirementsChoices.NONE;
    }
  }
});

return {
  Frequency: userInfo.frequency,
  PremiumInstallements: numOfPremiumInstallments,
  GrossInsurancePremium: grossInsurancePremium,
  Age: age[0],
  AnnualPremiumsPayable: annualPremiumsPayable,
  TermsInYears: termsInYears,
  memberDetails,
};
