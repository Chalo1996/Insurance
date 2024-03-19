#!/usr/bin/env node

// External Modules
import readline from 'readline';

// Custom Modules


// User Information

const userInfo = {
  userName: '',
  coverType: '',
  premiumFrequency: '',
  numOfPremiumInstallments: 1,
  sumAssured: 0,
  termsInMonths: 0,
  individualRetrenchmentCover: false,
  numberOfPartners: 0,
  userDateOfBirths: ['1/1/2000', '3/10/1977'],
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const isValidDateFormat = (dateString) => {
  const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  return dateRegex.test(dateString);
};

const validateCoverType = (coverType) => {
  return coverType === 'single' || coverType === 'multiple';
};

const validatePremiumFrequency = (frequency) => {
  return frequency === 'single' || frequency === 'annual';
};

const validateNumber = (value) => {
  return !isNaN(value);
};

const validateYesNo = (choice) => {
  return choice === 'Yes' || choice === 'No';
};

const getUserInput = async (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const main = async () => {
  try {
    userInfo.userName = await getUserInput("Enter your name: ");
    if (!userInfo.userName) {
      throw new Error("Name cannot be empty.");
    }
    console.log(`Welcome ${userInfo.userName}!`);

    userInfo.coverType = await getUserInput("Select cover type (single/multiple): ");
    if (!validateCoverType(userInfo.coverType)) {
      throw new Error("Invalid cover type. Please select 'single' or 'multiple'.");
    }

    // Clear DoBs in preparation fo new DoBs
    if (userInfo.userDateOfBirths.length > 0) {
      userInfo.userDateOfBirths.length = 0;
    }

    if (userInfo.coverType === 'multiple') {
      userInfo.numberOfPartners = parseInt(await getUserInput("Enter number of partners: "));
      if (!validateNumber(userInfo.numberOfPartners) || userInfo.numberOfPartners <= 0) {
        throw new Error("Number of partners must be a positive number.");
      }
      for (let i = 0; i < userInfo.numberOfPartners; i++) {
        const dob = await getUserInput(`Enter Date of Birth for user ${i + 1} (MM/DD/YYYY): `);
        if (!isValidDateFormat(dob)) {
          throw new Error("Invalid date of birth format. Please provide dates in MM/DD/YYYY format.");
        }
        userInfo.userDateOfBirths.push(dob);
      }
    } else {
      const dob = await getUserInput("Enter Date of Birth (MM/DD/YYYY): ");
      if (!isValidDateFormat(dob)) {
        throw new Error("Invalid date of birth format. Please provide dates in MM/DD/YYYY format.");
      }
      userInfo.userDateOfBirths.push(dob);
    }

    userInfo.sumAssured = parseInt(await getUserInput("Enter sum assured: "));
    if (!validateNumber(userInfo.sumAssured) || userInfo.sumAssured <= 0) {
      throw new Error("Sum assured must be a positive number.");
    }

    userInfo.termsInMonths = parseInt(await getUserInput("Enter terms in months: "));
    if (!validateNumber(userInfo.termsInMonths) || userInfo.termsInMonths <= 0) {
      throw new Error("Terms in months must be a positive number.");
    }

    if (userInfo.coverType === 'single') {
      const retrenchmentCoverChoice = await getUserInput("Do you want individual retrenchment cover (Yes/No): ");
      if (!validateYesNo(retrenchmentCoverChoice)) {
        throw new Error("Invalid choice. Please select 'Yes' or 'No'.");
      }
      retrenchmentCoverChoice === 'Yes' ? userInfo.individualRetrenchmentCover = true : false;
    }

    userInfo.premiumFrequency = await getUserInput("Select premium frequency (single/annual): ");
    if (!validatePremiumFrequency(userInfo.premiumFrequency)) {
      throw new Error("Invalid premium frequency. Please select 'single' or 'annual'.");
    }

    console.log("Inputs validated successfully.");
  } catch (error) {
    console.error("Input validation error:", error.message);
  } finally {
    rl.close();
  }
};

export { userInfo, main };
