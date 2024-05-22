//block

/**
 * @name M3TrainingGroupCreditFixedRating
 * @version 1
 * @author Emmanuel Chalo <emmanuel.chalo@equitybank.co.ke>
 * @description: Commands for calculating various benefits and total premiums payable for group credit fixed rating.
 * @category View
 * @createDate 02-4-2024
 * @lastEdition 20-5-2024
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
  policyEffectiveDate: "1/1/22",
  illnessRiderConst: 3000000,
  freeCoverLimitMedical: 15000000,
};

const userInfo = _userInfo;
const memberDetails = _memberDetails;
const frequency = userInfo.frequency;
const numberOfPartners = userInfo.numberOfPartners;
const covertype = userInfo.coverType;
const retRate = parseFloat(userInfo.retRate / 100);
const gcRate = parseFloat(userInfo.gcRate / 100);
const discount = parseFloat(userInfo.discount / 100);
const freeCoverLimitGC = userInfo.freeCoverLimit;

// Not used currently but might be useful in future
let numOfPremiumInstallments;
switch (frequency) {
  case "Annual":
    numOfPremiumInstallments = 1;
    break;
  case "SemiAnnually":
    numOfPremiumInstallments = 2;
    break;
  case "Quarterly":
    numOfPremiumInstallments = 4;
    break;
  case "Monthly":
    numOfPremiumInstallments = 12;
    break;
  default:
    numOfPremiumInstallments = 1;
}

let grossInsurancePremium = 0;
let annualPremiumsPayable = 0;
const retrenchment =
  userInfo.individualRetrenchmentCover === "Yes" ? true : false;

const medicalRequirementsChoices = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  HIV: "HIV",
  NONE: "NONE",
};

// Calculates ANB -> Age Next Birthday
const calculateAge = (dob) => {
  if (!dob) return "";
  if (typeof dob !== "string" || !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dob)) {
    throw new Error(
      "Invalid date format. Please provide date in MM/DD/YYYY format."
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
  effectiveDate
) => {
  const issueDateTime = new Date(issueDate);
  const effectiveDateTime = new Date(effectiveDate);

  const adjustedDate = new Date(
    issueDateTime.getFullYear(),
    issueDateTime.getMonth() + repaymentPeriod,
    issueDateTime.getDate() - 1
  );

  // Number of milliseconds in a day
  const oneDay = 1000 * 60 * 60 * 24;

  // Number of days on cover
  const loanDaysOnCover = Math.ceil(
    (adjustedDate - effectiveDateTime) / oneDay
  );

  return loanDaysOnCover;
};

const annuitantAge = calculateAge(userInfo.annuitantDoB);

const getPartnersAges = () => {
  const partnersAges = userInfo.partnersDatesOfBirths.map((dob) =>
    calculateAge(dob)
  );
  return partnersAges;
};

const ages = getPartnersAges();
const verifyEachPartnerAge = () => {
  ages.forEach((age) => {
    if (age >= 18 && age <= 70) {
      return true;
    } else {
      if (age < 18) {
        throw new Error(`Age can not be less than ${age}`);
      } else if (age > 70) {
        throw new Error(`Age can not be greater than ${age}`);
      }
    }
  });
};

const [P, T, N] = [
  userInfo.sumAssured,
  userInfo.termsInMonths,
  covertype === "Multiple" ? numberOfPartners + 1 : 1,
];

const premiumFormular =
  gcRate * P * (T / 12) + gcRate * P * (T / 12) * discount * (N - 1);

// Round of to One Decimal Place
const roundOf = (value) => {
  return Math.round(value * 10) / 10;
};

const termsInYears = roundOf(userInfo.termsInMonths / 12);

const divider =
  frequency === "Annual"
    ? termsInYears
    : frequency === "Monthly"
    ? userInfo.termsInMonths
    : frequency === "Quarterly"
    ? termsInYears * 4
    : frequency === "SemiAnnually"
    ? termsInYears * 2
    : 1;

if (covertype === "Single" && retrenchment) {
  grossInsurancePremium =
    premiumFormular + (retRate - gcRate) * userInfo.sumAssured;
} else if (
  covertype === "Multiple" ||
  (covertype === "Single" && !retrenchment)
) {
  grossInsurancePremium = premiumFormular;
} else {
  grossInsurancePremium = 0;
}

annualPremiumsPayable = roundOf(grossInsurancePremium / divider);

annualPremiumsPayable = Math.round(annualPremiumsPayable);
grossInsurancePremium = Math.round(grossInsurancePremium);

// Group and Medical Requirements Section
memberDetails.push({
  memberName: userInfo.memberName,
  idNumber: 67676767,
  DoB: userInfo.annuitantDoB,
  loanAccountNumber: 98776868,
  loanAmountOrOSBalance: 5000000,
  loanRepaymentPeriodInMonths: userInfo.termsInMonths,
  loanInterestRate: 14.5,
  loanIssueDate: "1/1/2024",
  fullSumAssured: userInfo.sumAssured,
  permanentTotalDisability: 5000000,
  lastExpense: 150000,
  individualRetrenchmentCover: 5000000,
  acceptanceTerms: 0,
});

memberDetails.forEach((member) => {
  member.ANB = calculateAge(member.DoB);
  member.sumAssuredWithinFCL = roundOf(
    Math.min(member.loanAmountOrOSBalance, constants.freeCoverLimitMedical)
  );
  member.sumAssuredAboveFCL = roundOf(
    member.fullSumAssured - member.sumAssuredWithinFCL
  );
  member.noOfDaysOnCover = roundOf(
    calculateLoanDaysOnCover(
      member.loanIssueDate,
      member.loanRepaymentPeriodInMonths,
      constants.policyEffectiveDate
    )
  );
  member.death = roundOf(
    (member.fullSumAssured *
      constants.deathOutstandingLoanAmountUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year)
  );
  member.criticalIllnessRider = roundOf(
    Math.min(
      constants.criticalIllnessRiderDiscount * member.fullSumAssured,
      constants.illnessRiderConst
    )
  );
  member.medicalLoading = roundOf(
    (member.sumAssuredAboveFCL *
      constants.deathOutstandingLoanAmountUnitRate *
      member.acceptanceTerms) /
      (constants.thousandRate * 100)
  );
  member.PTD = roundOf(
    (member.permanentTotalDisability *
      constants.totalDisabilityoutstandingLoanAmountUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year)
  );
  member.criticalIllNess = roundOf(
    (member.criticalIllnessRider *
      constants.criticalIllnessStandAloneAcceleratedUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year)
  );
  member.funeralExpenseOne = roundOf(
    (member.lastExpense *
      constants.lastexpenseUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year)
  );
  member.funeralExpenseTwo = roundOf(
    (member.individualRetrenchmentCover *
      constants.retrenchmentUnitRate *
      member.noOfDaysOnCover) /
      (constants.thousandRate * constants.year)
  );
  member.totalAnnualPremiums = roundOf(
    member.death +
      member.medicalLoading +
      member.PTD +
      member.criticalIllNess +
      member.funeralExpenseOne +
      member.funeralExpenseTwo
  );
});

memberDetails.forEach((member) => {
  member.medicalRequirements = medicalRequirementsChoices.NONE;
  const age = calculateAge(member.DoB);

  if (age === null || age === "") {
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
  premiumFormular,
  P,
  T,
  N,
  retRate,
  gcRate,
  discount,
  freeCoverLimitGC,
  Frequency: userInfo.frequency,
  PremiumInstallements: numOfPremiumInstallments,
  GrossInsurancePremium: grossInsurancePremium,
  individualRetrenchmentCover: retrenchment,
  annuitantAge,
  AnnualPremiumsPayable: annualPremiumsPayable,
  TermsInYears: termsInYears,
  memberDetails,
  medicalRequirements:
    memberDetails[memberDetails.length - 1].medicalRequirements,
};
