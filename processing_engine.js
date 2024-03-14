#!/usr/bin/env node

/**
 *
 * The processing engine is responsible for using the inputs provide by the input engine
 * to calculate the premium of the product. The inputs provided by the input engine are:
 * - inputs: The details of the product.
 * - rates: The rates of the product.
 */

const ageCalc = require('./ageCalc');
const { inputs, rates } = require('./input_engine');

// A function to return the cover type of the product.
function getCoverType() {
  return inputs.coverType;
}

// A function to return the section of the product.
function getSection(covertype) {
  if (covertype === 'multiple') {
    return inputs.sectionB;
  } if (covertype === 'single') {
    return inputs.sectionA;
  } return null;
}

// A function to return sectionC of the product.
function getSectionC() {
  return inputs.sectionC;
}

function getMultipleInsurancePremium() {
  const covertype = getCoverType().multiple;
  const section = getSection(covertype);
  const [P, T, N] = [
    section.sumAssured, section.termsInMonths,
    section.DoBOfBirthOfPartners.length];

  if (section.numberOfPartners !== N) {
    throw new Error('Please provide dates of birth equivalent to the number of partners');
  }

  const premium = (rates.gcRate * P * (T / 12))
    + (rates.gcRate * P * (T / 12)
    * 0.7 * (N - 1));

  const ages = [];

  for (const age of section.DoBOfBirthOfPartners) {
    ages.push(ageCalc(age));
  }
  return premium;
}

const getSingleInsurancePremium = {
  coverType: getCoverType().single,
  section: getSection(getCoverType().single),
  dob: ageCalc(getSection(getCoverType().single).DoB),

  checkerFunc() {
    const { section } = this;
    const { dob } = this;
    const retrenchmentCover = (dob >= 18 && dob <= 70 && section.individualRetrenchmentCover)
      ? rates.gcRate * section.sumAssured * (section.termsInMonths / 12)
      + (rates.retRate - rates.gcRate)
      * section.sumAssured : rates.gcRate
      * section.sumAssured * (section.termsInMonths / 12);

    return retrenchmentCover;
  },
};

function singleIndividualCalc() {
  return getSingleInsurancePremium;
}
singleIndividualCalc();

function multipleIndividualCalc() {
  return getMultipleInsurancePremium();
}

module.exports = {
  getCoverType,
  getSection,
  getSectionC,
  singleIndividualCalc,
  multipleIndividualCalc,
};
