#!/usr/bin/env node
/**
 * This module contains calculators used to:
 * - Calculate the age of a client based on their date of birth.
 * - Calculate the number of days a client's loan was covered based on their issue date, repayment periods, and effective date.
 */

const periodCalculators = {

  // Date Format: (MM/DD/YYYY) Verifier
  isValidDateFormat(dateString) {
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return dateRegex.test(dateString);
  },

  // Calculates ANB -> Age Next Birthday
  calculateAge(dob) {
    /**
     * This method calculates the age of a client based on their date of birth.
     * 
     * @param {string} dob - The client's date of birth.
     * @returns {number} - The client's age.
     * 
     * @example
     * const dateOfBirth = '1990-01-01';
     * const age = calculateAge(dateOfBirth);
     */
    if (!dob) return '';
    if (typeof dob !== 'string' || !this.isValidDateFormat(dob)) {
      throw new Error('Invalid date format. Please provide date in MM/DD/YYYY format.');
    }
  
    const dobDate = new Date(dob);
    const currentDate = new Date();
  
    let age = currentDate.getFullYear() - dobDate.getFullYear();
    const monthDifference = currentDate.getMonth() - dobDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dobDate.getDate())) {
      age--;
    }
  
    // ANB -> Age Next Birthday
    return age - 1;
  },

  // Calculates Loan Due Date in Days for Each Individual
  calculateLoanDaysOnCover(issueDate, repaymentPeriods, effectiveDate) {
    /**
     * This method calculates a the number of days a client's loan was
     * covered based on their issue date, repayment periods, and effective date.
     *
     * @param {string} issueDate - The date the loan was issued.
     * @param {number} repaymentPeriods - The number of repayment periods for the loan.
     * @param {string} effectiveDate - The date the loan was effective.
     * @returns {number} - The number of days the loan was covered.
     *
     * @example
     * const issueDate = '1/13/2022';
     * const repaymentPeriods = 120;
     * const effectiveDate = '1/1/2022';
     * const loanDaysOnCover = calculateLoanDaysOnCover(issueDate, repaymentPeriods, effectiveDate);
     * console.log('Loan days on cover:', loanDaysOnCover);
     */

    // Convert string dates to Date objects
    const issueDateTime = new Date(issueDate);
    const effectiveDateTime = new Date(effectiveDate);
  
    // Adjust the issue date based on repayment period
    const adjustedDate = new Date(
        issueDateTime.getFullYear(),
        issueDateTime.getMonth() + repaymentPeriods,
        issueDateTime.getDate() - 1
    );
  
    // Number of milliseconds in a day
    const oneDay = 1000 * 60 * 60 * 24;
  
    // Number of days on cover
    const loanDaysOnCover = Math.ceil((adjustedDate - effectiveDateTime) / oneDay);
  
    return loanDaysOnCover;
  },
}

export default periodCalculators;
