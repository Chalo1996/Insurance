#!/usr/bin/env node

/**
 *
 * The input engine consists of all the inputs the beneficiary should provide and or
 * fixed input variables by the insurance company that are used to calculate the
 * premium they should be charged for the insurance policy.
 */

const { argv } = require('node:process');

const rates = {
  retRate: 0.00775,
  gcRate: 0.00675,
};

const inputs = {
  coverType: {
    multiple: 'multiple',
    single: 'single',
  },
  sectionA: {
    sumAssured: argv[3] || 40000000,
    DoB: '1/1/2000',
    termsInMonths: 196,
    individualRetrenchmentCover: true,
  },
  sectionB: {
    sumAssured: argv[3] || 15000000,
    termsInMonths: 84,
    numberOfPartners: argv[4] || 5,
    DoBOfBirthOfPartners: argv[5] || [
      '2/1/2000',
      '2/2/1988',
      '2/2/1987',
      '2/2/1986',
      '2/2/1985',
    ],
  },
  sectionC: {
    premiumFrequency: {
      single: 'single',
      annual: 'annual',
    },
    NumOfPremiumInstallments: 1,
  },
};

module.exports = { inputs, rates };
