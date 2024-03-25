/**
 * This module contains the subroutine to determine a client's
 * medical benefits.
 */

// Custom Modules
import periodCalculators from "./Calculators.js";

const medicalRequirementsChoices = { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F', HIV: 'HIV', NONE: 'NONE' };

export default function calculateMedicalRequirements(dateOfBirth, sumAssuredAboveFCL) {
    /**
     * This method calculates the medical requirements for a client based on their age and sum assured.
     * The medical requirements are determined based on the following rules:
     * - If the client's age is 45 or older, the medical requirements are 'A+B+C+D+E+F+HIV'.
     * - If the client's age is between 40 and 44, the medical requirements are 'A+B+C+D+E+HIV'.
     * - If the client's age is between 35 and 39, the medical requirements are 'A+B+C+D+HIV'.
     * - If the client's age is between 30 and 34, the medical requirements are 'A+B+C+HIV'.
     * - If the client's age is between 25 and 29, the medical requirements are 'A+B+HIV'.
     * - If the client's age is between 20 and 24, the medical requirements are 'A+HIV'.
     * - If the client's age is between 15 and 19, the medical requirements are 'A'.
     * - If the client's age is between 10 and 14, the medical requirements are 'NONE'.
     * 
     * @param {string} dateOfBirth - The client's date of birth.
     * @param {number} sumAssuredAboveFCL - The client's sum assured above FCL.
     * @returns {string} - The client's medical requirements.
     * 
     * @example
     * const dateOfBirth = '1990-01-01';
     * const sumAssuredAboveFCL = 5000000;
     * const medicalRequirements = calculateMedicalRequirements(dateOfBirth, sumAssuredAboveFCL);
     * console.log(medicalRequirements); // 'B+C+D+E+F+HIV'
     */

    const age = periodCalculators.calculateAge(dateOfBirth);
    let medicalRequirement = medicalRequirementsChoices.NONE;

    if (age === null || age === '') {
        if (sumAssuredAboveFCL > 5000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.F}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 4000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 3000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 2000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 0) {
            medicalRequirement = `${medicalRequirementsChoices.B}`;
        } else {
            medicalRequirement = medicalRequirementsChoices.NONE;
        }
    } else if (age > 45) {
        if (sumAssuredAboveFCL > 5000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.F}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 4000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 3000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 2000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 0) {
            medicalRequirement = `${medicalRequirementsChoices.B}`;
        } else {
            medicalRequirement = medicalRequirementsChoices.NONE;
        }
    } else {
        if (sumAssuredAboveFCL > 5000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.F}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 4000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.E}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 3000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.D}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 2000000) {
            medicalRequirement = `${medicalRequirementsChoices.B}+${medicalRequirementsChoices.C}+${medicalRequirementsChoices.HIV}`;
        } else if (sumAssuredAboveFCL > 0) {
            medicalRequirement = `${medicalRequirementsChoices.B}`;
        } else {
            medicalRequirement = medicalRequirementsChoices.NONE;
        }
    }

    return medicalRequirement;
}

