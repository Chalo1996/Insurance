#!/usr/bin/env node
/**
 * This is the output module. It is used to console the
 * computated data in a tabular format to the stdout.
 */

// Custom Modules
import ProcessingEngine from "./processing_engine/processing_engine.js";
import { coverType, paymentOptions, userInfo } from './input_engine.js';
import { memberDetails } from './member_details.js';
import periodCalculators from './processing_engine/periodCalculators.js';

// This section is used to generate the client quotation.
const engine = new ProcessingEngine();
const covertype = engine.getCoverType();
const totalPremiumsPayable = engine.premiumCalculator().toFixed(0);
const annualPremiumPayable = (totalPremiumsPayable
  / paymentOptions.numOfPremiumInstallments)
  .toFixed(0);

const clientQuotation = [
  {
    "Total Premiums Payable": totalPremiumsPayable,
    "Annual Premium Payable": annualPremiumPayable,
    "Cover Type": covertype,
    "Payment Terms in Months": userInfo.termsInMonths,
    "Payment Terms in Years": userInfo.termsInMonths / 12,
  }
];

if (covertype === 'multiple') {
  for(let i = 0; i < userInfo.userDateOfBirths.length; i++) {
    clientQuotation.push({
      "D.O.B": userInfo.userDateOfBirths[i],
      "Age Next BirthDay": engine.getAge()[i]
    });
  }
} else {
  clientQuotation.push({
    "D.O.B": userInfo.userDateOfBirths[0],
    "Age Next BirthDay": engine.getAge()[0]
  });
}

// This section is used to generate the users table.
engine.main();

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

// console.log("\n\t\t\t\t\t\t\t\t\t\t\tClient Quotation")
// console.table(clientQuotation);

console.table(usersTableOutput);