#!/usr/bin/env node

function isValidDateFormat(dateString) {
  // Regular expression to validate date format (MM/DD/YYYY)
  const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  return dateRegex.test(dateString);
}

function calculateAge(dob) {
  if (typeof dob !== 'string' || !isValidDateFormat(dob)) {
    throw new Error("Invalid date format. Please provide date in MM/DD/YYYY format.");
  }

  const dobDate = new Date(dob);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dobDate.getFullYear();
  const monthDifference = currentDate.getMonth() - dobDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dobDate.getDate())) {
    age--;
  }

  return age + 1;
}

// const dob = '2/1/1989'; // Date of birth
// const age = calculateAge(dob);
// console.log("Age:", age);

module.exports = calculateAge;
