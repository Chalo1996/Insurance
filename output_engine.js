#!/usr/bin/env node

/**
 * The output engine prints out to the stdout the quotation generated by the
 * processing engine.
 */

const {
  getCoverType,
  getSection,
  getSectionC,
  getMultipleInsurancePremium,
  getSingleInsurancePremium,
  singleIndividualCalc,
  multipleIndividualCalc,
} = require('./processing_engine');

let covertype = '';

if (getCoverType === 'single') {
  covertype = 'Single Individual & Sole Proprietorship';
} covertype = 'Multiple Individuals & Partnerships';

const coverType = getCoverType().single;
const section = getSection(coverType);
const termsInYrs = (section.termsInMonths / 12).toPrecision(3);
const benefit = section.individualRetrenchmentCover ? 'Yes' : 'No';
const totalPremiumPayable = coverType === 'single' ? singleIndividualCalc() : multipleIndividualCalc();
const NumOfPremiumInstallments = 0.2;
const annualPremiumPayable = totalPremiumPayable / NumOfPremiumInstallments;

const retrenchmentString = `
  -----------------------------------------------------------------------------
  |                              Selected Optional Benefits                   |
  -----------------------------------------------------------------------------
  |Retrenchment Cover/Job Loss    |  ${benefit}                               |
  -----------------------------------------------------------------------------
`;

const outputString = `\n\t\t\tPolicy Quotation\n
  -----------------------------------------------------------------------------
  |                              Policy Details                               |
  -----------------------------------------------------------------------------
  |Type of Cover                  |  ${covertype}                             |
  -----------------------------------------------------------------------------
  |Term in Months                 |  ${section.termsInMonths}                 |
  -----------------------------------------------------------------------------
  |Term in Years                  |  ${termsInYrs}                            |
  -----------------------------------------------------------------------------
  |Initial Sum Assured            |  ${section.sumAssured}                    |
  -----------------------------------------------------------------------------
  |Premium Frequency              |  ${getSectionC().premiumFrequency.annual} |
  -----------------------------------------------------------------------------

  ${ coverType === 'single' ? retrenchmentString : ''}
                                              
  -----------------------------------------------------------------------------
  |                              Premium details                              |
  -----------------------------------------------------------------------------
  |Annual Premium Payable         | ${annualPremiumPayable}                   |
  -----------------------------------------------------------------------------
  |Number of Premium Installments | ${NumOfPremiumInstallments}               |
  -----------------------------------------------------------------------------
  |Total Premiums payable         | ${totalPremiumPayable}                    |
  -----------------------------------------------------------------------------
  `;

console.log(outputString);
