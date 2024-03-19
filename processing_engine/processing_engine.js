#!/usr/bin/env node

// Custom Modules
import { main, userInfo } from '../input_engine.js';
import calculateAge from './ageCalc.js';

const constants = {
  retRate: 0.00775,
  gcRate: 0.00675,
  withRETconst() {
    return (this.retRate - this.gcRate) * userInfo.sumAssured;
  },
}
export default class ProcessingEngine {

  constructor() {
    this.userInfo = userInfo;
  }

  getAge () {
    const ages =  this.userInfo.userDateOfBirths.map((dob) => calculateAge(dob));
    return ages;
  }

  verifyAge() {
    let isValid = false;

    this.getAge().forEach((age) => {
      if (age >= 18 && age <= 70) {
        isValid = true;
      }
    })

    return isValid;
  }

  getCoverType() {
    return this.userInfo.coverType;
  }

  getRetrechmentCover() {
    return this.userInfo.individualRetrenchmentCover;
  }

  getPaymentFrequency() {
    return this.userInfo.premiumFrequency;
  }

  getFormular() {
    const coverType = this.getCoverType();
    const [P, T, N] = [
      this.userInfo.sumAssured, this.userInfo.termsInMonths,
      coverType === 'multiple' ? this.userInfo.userDateOfBirths.length : 1,
    ];
    
    const premiumFormular = (constants.gcRate * P * (T / 12))
      + (constants.gcRate * P * (T / 12)
      * 0.7 * (N - 1));

    return premiumFormular;
  }

  premiumCalculator() {
    let grossInsurancePremium;

    const coverType = this.getCoverType();
    const retrenchment = this.getRetrechmentCover();

    if (this.verifyAge()) {
      if (coverType === 'single' && retrenchment) {
        grossInsurancePremium = this.getFormular() + constants.withRETconst();
      } else if (coverType === 'multiple' || coverType === 'single' && !retrenchment) {
        grossInsurancePremium = this.getFormular();
      } else {
        grossInsurancePremium = 0;
      };
    } else {
      throw new Error("Age must be between 18 and 70 years.")
    };
    return grossInsurancePremium;
  }
}
