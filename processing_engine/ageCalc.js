#!/usr/bin/env node
/**
 *
 * @param {*} dateString : A date string used to calculate the age(s) of the beneficiary(ies).
 * @returns The Age Next Birthday of the beneficiary(ies)
 */

export default function calculateAge(dob) {
  const dobDate = new Date(dob);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dobDate.getFullYear();
  const monthDifference = currentDate.getMonth() - dobDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < dobDate.getDate())) {
    // eslint-disable-next-line no-plusplus
    age--;
  }
  
  // ANB -> Age Next Birthday
  return age + 1;
}
