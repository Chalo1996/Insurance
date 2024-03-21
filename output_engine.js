#!/usr/bin/env node
/**
 * This is the output module. It is used to console the
 * computated data in a tabular format to the stdout.
 * @usage
 * @param {object} userInfo - The user information. This has the following structure:
 *  const userInfo = {
      sumAssured: Number, e.g, 40000
      termsInMonths: Number, e.g, 60
      individualRetrenchmentCover: Boolean, e.g true,
      numberOfPartners: Number, e.g, 2
      userDateOfBirths: Array, e.g, ['1/2/1967', '1/1/2000', '3/10/1977'],
    };.
 * @param {object} paymentOptions - The payment options. This has the following structure:
    const paymentOptions = {
      premiumFrequency: {
        monthly: 'monthly',
        annual: 'annual',
      },
      numOfPremiumInstallments: Number e.g, 4, // Quartely
    };
 * @param {object} coverType - The cover type. his has the following structure:
    const coverType = {
      single: 'single',
      multiple: 'multiple',
    };
 * @param {object} memberDetails - The member details. An Array of objects of members. It has the following structure:
    const memberDetails = [
    {
      memberName: "A N OTHER",
      idNumber: 67676767,
      DoB: '1/1/1981',
      loanAccountNumber: 98776868,
      loanAmountOrOSBalance: 5000000,
      loanRapaymentPeriodInMonths: 36,
      loanInterestRate: 14.5,
      loanIssueDate: '1/1/2022',
      fullSumAssured: 5000000,
      permanentTotalDisability: 5000000,
      lastExpense: 150000,
      retrenchment: 5000000,
      acceptanceTerms: 0,
      },
      ....
      ....
      ....
    ]
 * @returns {object} - The computed data. The grossInsurance Premium:
 * @example
 *  const grossInsurancePremium = calculateGroupCreditPremiumFixedRating(userInfo, paymentOptions, coverType, memberDetails);
 */

// Custom Modules
import { coverType, paymentOptions, userInfo } from './input_engine.js';
import { memberDetails } from './member_details.js';
import periodCalculators from './processing_engine/periodCalculators.js';
import calculateGroupCreditPremiumFixedRating from './processing_engine/processing_engine.js';

const grossInsurancePremium = calculateGroupCreditPremiumFixedRating(userInfo, paymentOptions, coverType, memberDetails);

// console.log(`\t\t\t\t\t\t\t\tGross Insurance Premium Quotation: ${grossInsurancePremium}`);

const usersTableOutput = [];

memberDetails.forEach((member, idx) => {
  usersTableOutput.push({
    "MEMBER NUMBER": idx + 1,
    "MEMBER NAMES": member.memberName,
    "ID NUMBER": member.idNumber,
    "D.O.B": member.DoB,
    "ANB": member.ANB,
    "LOAN ACCOUNT NUMBER": member.loanAccountNumber,
    "LOAN AMOUNT/ OS BALANCE (KSHS)": member.loanAmountOrOSBalance,
    "LOAN REPAYMENT PERIOD (Months)": member.loanRapaymentPeriodInMonths,
    "LOAN INTEREST RATE": `${member.loanInterestRate}%`,
    "LOAN ISSUE DATE": member.loanIssueDate,
    "FULL SUM ASSURED (KSHS)": member.fullSumAssured,
    "SUM ASSURED WITHIN FCL (KSHS)": member.sumAssuredWithinFCL,
    "SUM ASSURED ABOVE FCL (KSHS)": member.sumAssuredAboveFCL,
    "PERMANENT TOTAL DISABILITY (KSHS)": member.permanentTotalDisability,
    "CRITICAL ILLNESS RIDER (KSHS)": member.criticalIllnessRider,
    "LAST EXPENSE": member.lastExpense,
    "RETRENCHMENT (KSHS)": member.retrenchment,
    "ACCEPTANCE TERMS": `${member.acceptanceTerms}%`,
    "NO OF DAYS ON COVER": member.noOfDaysOnCover,
    "DEATH (KESHS)": member.death,
    "MEDICAL LOADING (KSHS)": member.medicalLoading,
    "PTD (KSHS)": member.PTD,
    "CRITICAL ILLNESS (KSHS)": member.criticalIllNess,
    "FUNERAL EXPENSE1 (KSHS)": member.funeralExpenseOne,
    "FUNERAL EXPENSE2 (KSHS)": member.funeralExpenseTwo,
    "ANNUAL PREMIUMS(TOTAL (KSHS))": member.totalAnnualPremiums,
    "MEDICAL REQUIREMENTS": member.medicalRequirements,
  })});

console.table(usersTableOutput);