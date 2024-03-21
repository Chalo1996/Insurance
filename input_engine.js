#!/usr/bin/env node
/**
 * This module contains a sample user data that is used to
 * generate their quotation.
 */

const coverType = {
  single: 'single',
  multiple: 'multiple',
};

const paymentOptions = {
  premiumFrequency: {
    monthly: 'monthly',
    annual: 'annual',
  },
  numOfPremiumInstallments: 4, // Quartely
};

const userInfo = {
  sumAssured: 5000000,
  termsInMonths: 36,
  individualRetrenchmentCover: false,
  numberOfPartners: 2,
  namesOfBeneficiaries: ['John', 'Jane'],
  userDateOfBirths: ['1/2/1967', '1/1/2000', '3/10/1977'],
};

export { coverType, paymentOptions, userInfo };
