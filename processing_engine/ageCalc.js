#!/usr/bin/env node
/**
 *
 * @param {*} dateString : A date string used to calculate the age(s) of the beneficiary(ies).
 * @returns The Age Next Birthday of the beneficiary(ies)
 */

function isValidDateFormat(dateString) {
  // Regular expression to validate date format (MM/DD/YYYY)
  const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  return dateRegex.test(dateString);
}

function calculateAge(dob) {
  if (typeof dob !== 'string' || !isValidDateFormat(dob)) {
    throw new Error('Invalid date format. Please provide date in MM/DD/YYYY format.');
  }

  const dobDate = new Date(dob);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dobDate.getFullYear();
  const monthDifference = currentDate.getMonth() - dobDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dobDate.getDate())) {
    // eslint-disable-next-line no-plusplus
    age--;
  }

  return age + 1;
}

module.exports = calculateAge;
