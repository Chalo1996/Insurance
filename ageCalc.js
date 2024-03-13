#!/usr/bin/env node

function calculateAge(...dobs) {
  let dobDate;
  for (const dob of dobs) {
    if (typeof dob !== 'string' || !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dob)) {
      throw new Error('Invalid date of birth');
    }
    dobDate = new Date(dob);
  }
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dobDate.getFullYear();
  const monthDifference = currentDate.getMonth() - dobDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dobDate.getDate())) {
    age--;
  }

  return age + 1;
}

module.exports = calculateAge;
