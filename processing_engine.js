#!/usr/bin/env node

/**
 * The processing engine is responsible for using the inputs provide by the input engine
 * to calculate the premium of the product. The inputs provided by the input engine are:
 * - productDetails: The details of the product.
 * - rates: The rates of the product.
 */

const ageCalc = require('./ageCalc');
const { productDetails, rates } = require('./input_engine');

// A function to return the cover type of the product.
function getCoverType() {
  return productDetails.coverType;
}

// A function to return the section of the product.
function getSection(covertype) {
  if (covertype === 'multiple') {
    return productDetails.sectionB;
  } if (covertype === 'single') {
    return productDetails.sectionA;
  } return null;
}

// A function to return sectionC of the product.
function getSectionC() {
  return productDetails.sectionC;
}

function getMultipleInsurancePremium() {
  const covertype = getCoverType().multiple;
  const section = getSection(covertype);
  // console.log('Chosing Section B:\n\t', section);
  const [P, T, N] = [section.sumAssured, section.termsInMonths, section.DoBOfBirthOfPartners.length];
  // console.log(`P: ${P}`);
  // console.log(`T: ${T}`);
  // console.log(`N: ${N}`);
  const premium = (rates.gcRate * P * (T / 12)) + (rates.gcRate * P * (T / 12) * 0.7 * (N - 1));
  const ages = [];
  for (const age of section.DoBOfBirthOfPartners) {
    ages.push(ageCalc(age));
  }
  return premium;
  // console.log(`DoBs: ${ages}`);
  // console.log(`Premium: ${premium}`);
}

function getSingleInsurancePremium() {
  const coverType = getCoverType().single;
  const section = getSection(coverType);
  const dob = ageCalc(section.DoB);

  const withRETgrossInsurancePremium = rates.gcRate * section.sumAssured * (section.termsInMonths / 12) + (rates.retRate - rates.gcRate) * section.sumAssured;
  const noRETgrossInsurancePremium = rates.gcRate * section.sumAssured * (section.termsInMonths / 12);

  if (dob >= 18 && dob <= 70 && section.individualRetrenchmentCover) {
    return withRETgrossInsurancePremium;
  } return noRETgrossInsurancePremium;
}

function singleIndividualCalc() {
  const coverType = getCoverType().single;
  // console.log(coverType);

  const section = getSection(coverType);
  // console.log('Chosing Section A:\n\t', section);
  const termsInYrs = (section.termsInMonths / 12).toPrecision(3);
  const dob = ageCalc(section.DoB);
  const grossInsurancePremium = getSingleInsurancePremium();
  // console.log(grossInsurancePremium);
  // console.log(`Your age is: ${dob}`);
  // console.log(`Your terms in years are: ${termsInYrs}`);
  return grossInsurancePremium;
}

function multipleIndividualCalc() {
  getMultipleInsurancePremium();
}

const calculator = {
  single: singleIndividualCalc,
  multiple: multipleIndividualCalc,
};

// console.log('Calculating Premium...\n');
// console.log('Calculating Premium for Single Individual...\n');
calculator.single();
// console.log('\nCalculating Premium for Multiple Individual...\n');
calculator.multiple();

module.exports = {
  getCoverType,
  getSection,
  getSectionC,
  getMultipleInsurancePremium,
  getSingleInsurancePremium,
  singleIndividualCalc,
  multipleIndividualCalc,
};
