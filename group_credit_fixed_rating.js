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
    sumAssured: 15000000,
    termsInMonths: 84,
    numberOfPartners: 5,
    DoBOfBirthOfPartners: [
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
  console.log('Chosing Section B:\n\t', section);
  const [P, T, N] = [section.sumAssured, section.termsInMonths, section.DoBOfBirthOfPartners.length];
  console.log(`P: ${P}`);
  console.log(`T: ${T}`);
  console.log(`N: ${N}`);
  const premium = (rates.gcRate * P * (T / 12)) + (rates.gcRate * P * (T / 12) * 0.7 * (N - 1));
  const ages = [];
  for (age of section.DoBOfBirthOfPartners) {
    ages.push(ageCalc(age));
  }
  console.log(`DoBs: ${ages}`);
  console.log(`Premium: ${premium}`);
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
  console.log(coverType);

  const section = getSection(coverType);
  console.log('Chosing Section A:\n\t', section);
  const termsInYrs = (section.termsInMonths / 12).toPrecision(3);
  const dob = ageCalc(section.DoB);
  const grossInsurancePremium = getSingleInsurancePremium();
  console.log(grossInsurancePremium);
  console.log(`Your age is: ${dob}`);
  console.log(`Your terms in years are: ${termsInYrs}`);
}

function multipleIndividualCalc() {
  getMultipleInsurancePremium();
}

const calculator = {
  single: singleIndividualCalc,
  multiple: multipleIndividualCalc,
};

// calculator.single();
calculator.multiple();
