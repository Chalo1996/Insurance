const constants = {
  /**
   * These are all the constants that are used in the calculation process.
   * They are defined here to make it easier to change them if needed.
   * The constants are used in the calculation process and are not directly
   * used in the output engine.
   */

  year: 365,
  thousandRate: 1000,
  criticalIllnessRiderDiscount: 0.3,
  retrenchmentUnitRate: 1.50,
  lastexpenseUnitRate: 5.50,
  criticalIllnessStandAloneAcceleratedUnitRate: 1.50,
  totalDisabilityoutstandingLoanAmountUnitRate: 0.00,
  deathOutstandingLoanAmountUnitRate: 5.50,
  policyEffectiveDate: '1/1/22',
  illnessRiderConst: 3000000,
  freeCoverLimit: 15000000,
  retRate: 0.00775,
  gcRate: 0.00675,
  discount: 0.7,
  withRETconst() {
    /**
     * This method returns the constant added to the formula for calculating
     * the gross insurance premium for the case of a single but with
     * retrenchment benefits member.
     */

    return (this.retRate - this.gcRate) * userInfo.sumAssured;
  },
};

export default constants;