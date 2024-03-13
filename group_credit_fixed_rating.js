#!/usr/bin/env node

const ageCalc = require('./ageCalc');

const rates = {
  retRate: 0.00775,
  gcRate: 0.00675,
};

const productDetails = {
  coverType: {
    multiple: 'multiple',
    single: 'single',
  },
  sectionA: {
    sumAssured: 40000000,
    DoB: '1/1/2000',
    termsInMonths: 196,
    individualRetrenchmentCover: Boolean,
  },
  sectionB: {
    sumAssured: 0,
    termsInMonths: 0,
    numberOfPartners: 0,
    DoBOfBirthOfPartners: [],
  },
  sectionC: {
    premiumFrequency: {
      single: 'single',
      annual: 'annual',
    },
    NumOfPremiumInstallments: 1,
  },
};

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

function getInsuarancePremium() {
  const coverType = getCoverType().single;
  const section = getSection(coverType);
  const dob = ageCalc(section.DoB);
  

  let withRETgrossInsurancePremium = rates.gcRate * section.sumAssured * (section.termsInMonths / 12) + (rates.retRate - rates.gcRate) * section.sumAssured;
  let noRETgrossInsurancePremium = rates.gcRate * section.sumAssured * (section.termsInMonths / 12);

  if (dob >= 18 && dob <= 70 && section.individualRetrenchmentCover) {
    return withRETgrossInsurancePremium;

  } else {
    return noRETgrossInsurancePremium;
  }
}

function singleIndividualCalc() {
  const coverType = getCoverType().single;
  console.log(coverType);

  const section = getSection(coverType);
  console.log('Chosing Section A:\n\t', section);
  const termsInYrs = (section.termsInMonths / 12).toPrecision(3);
  const dob = ageCalc(section.DoB);
  let grossInsurancePremium = getInsuarancePremium();
  console.log(grossInsurancePremium);
  console.log(`Your age is: ${dob}`);
  console.log(`Your terms in years are: ${termsInYrs}`);
}
// singleIndividualCalc();

function multipleIndividualCalc() {
  //
}

const calculator = {
  single: singleIndividualCalc,
  multiple: multipleIndividualCalc,
};

calculator.single();