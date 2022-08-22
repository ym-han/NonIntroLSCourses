/* Mortage calculator

Assumptions
-----------
* APR, loan amount and loan duration should be real numbers in (0, infinity).
* input loan duration should already be in months
* APR is decimal, and not percentage
  * Use default APR if no APR is supplied
  * Requiring that APR > 0 b/c can get NaN with negative APRs
*/

// -------- Globals
const readline = require('readline-sync');
const DEFAULT_MONTHLY_INTEREST_RATE = 0.05 / 12;

// Might be better to initialize config objects from a config file
const APRReqMessage = "This should be a decimal number like 0.01, and not a percentage; it should also be greater than 0.";
const APRInfoMessage = "Please supply the Annual Percentage Rate (APR).\n* "
  + APRReqMessage
  + `\n* If no APR is supplied, the default, ${DEFAULT_MONTHLY_INTEREST_RATE * 12}, will be used.\n`;
const APRErrorMessage = APRReqMessage;

const loanAmountDurationReqMessage = "This should be a real number in the open interval (0, infinity).";
const loanAmountInfoMessage = "Please supply the loan amount. " + loanAmountDurationReqMessage;
const loanDurationInfoMessage = "Please supply the loan duration, in months. " + loanAmountDurationReqMessage;
const loanAmountErrorMessage = loanAmountDurationReqMessage;
const loanDurationErrorMessage = loanAmountDurationReqMessage;


// -------- Helper functions

// --- For getting input
function prompt(message) {
  console.log(`${message}`);
}

function promptGetInput(message) {
  prompt(message);
  return readline.question().trim();
}


// --- For validating input

function withinOpenInterval(leftBound, rightBound, num) {
  return num > leftBound && num < rightBound;
}
const betweenZeroAndInf = num => withinOpenInterval(0, Infinity, num);
const notNan = num => !Number.isNaN(num);

// change these if want to add further validation
const loanAmountValidatorFuncs = [notNan, betweenZeroAndInf];
const loanDurationValidatorFuncs = [notNan, betweenZeroAndInf];
const APRValidatorFuncs = [notNan, betweenZeroAndInf];


// --- Wrapper functions for querying and validating
/**
 * @param {string} queryMessage - The message to query user with
 * @param {Array{number => boolean}}
 *        numValidatorFuncs - Functions to validate the parsed number
 * @param {string} invalidInputMessage - Message to display if input invalid
 * @param {{() => number} | undefined}
 *        numIfInputNullFunc - Function to call if input string is "" or "\n"
 * @param {number => number}
 *        userNumPostProcessFunc - For post processing parsed number
 */
function repeatQueryValidMaker(
  queryMessage, numValidatorFuncs, invalidInputMessage = "Input invalid!", numIfInputNullFunc = undefined, userNumPostProcessFunc = num => num
) {
  function configuredQueryValidate() {
    let trimdUserNumString, userNum, numIsValid;

    do {
      if (numIfInputNullFunc !== undefined && ["", "\n"].includes(trimdUserNumString)) {
        userNum = numIfInputNullFunc();
      } else if (numIsValid === false) {
        prompt(invalidInputMessage);
        // Could improve this by pinpointing the validation step that failed
      }

      trimdUserNumString = promptGetInput(queryMessage);
      userNum = userNumPostProcessFunc(Number(trimdUserNumString));

      const userNumCopy = userNum;
      numIsValid = trimdUserNumString !== '' && numValidatorFuncs.every(validator => validator(userNumCopy));
    } while (!numIsValid);

    return userNum;
  }
  return configuredQueryValidate;
}

// Initializing the maker func with specific configs
const queryValidateLoanAmount = repeatQueryValidMaker(
  loanAmountInfoMessage,
  loanAmountValidatorFuncs,
  loanAmountErrorMessage);
const queryValidateLoanDuration = repeatQueryValidMaker(
  loanDurationInfoMessage,
  loanDurationValidatorFuncs,
  loanDurationErrorMessage);

const APRIsNullFunc = () => DEFAULT_MONTHLY_INTEREST_RATE;
const queryValidateApr = repeatQueryValidMaker(
  APRInfoMessage,
  APRValidatorFuncs,
  APRErrorMessage,
  APRIsNullFunc,
  userApr => userApr / 12);
// If user does not supply APR,
// monthlyUserApr will be set to DEFAULT_MONTHLY_INTEREST_RATE.

/**
 * @return {{ loanAmount: number,
 *            monthlyUserApr: number,
 *            loanDurationMonths: number }}
 * Asks user for, and validates, loanAmount, userApr, loanDurationMonths.
 */
function queryAndValidateUser() {
  let monthlyUserApr = queryValidateApr();
  let loanAmount = queryValidateLoanAmount();
  let loanDurationMonths = queryValidateLoanDuration();

  return {
    loanAmount: loanAmount,
    monthlyUserApr: monthlyUserApr,
    loanDurationMonths: loanDurationMonths
  };
}


function calcLoan(loanAmount, monthlyUserApr, loanDurationMonths) {
  // do computation in log space to help with numerical stability
  let logMonthlyPayments = Math.log(loanAmount)
    + Math.log(monthlyUserApr)
    - Math.log(
      1 - Math.pow((1 + monthlyUserApr), (-loanDurationMonths))
    );
  let monthlyPayments = Math.exp(logMonthlyPayments);

  let totalPaymts = Math.exp(logMonthlyPayments + Math.log(loanDurationMonths));
  let totalInterest = totalPaymts - loanAmount;

  return {
    'Monthly Payments': monthlyPayments,
    'Total Payments': monthlyPayments * loanDurationMonths,
    'Total Interest': totalInterest
  };
}

function displayResults(loanDurationMonths, calcOutput) {
  console.log("\n==== RESULTS ===================\n");
  console.log("=> Loan duration in months: " + loanDurationMonths + "\n");
  for (const [key, value] of Object.entries(calcOutput)) {
    console.log(`=> ${key}: $${value.toFixed(2)}\n`);
    // a better rounding solution might be https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
  }
  console.log("===============================\n");
}

/**
 * @return {boolean}
 * Check if we want to run calculator again.
 */
function shouldCalcAnother() {
  let calcAnother, keepRunning;
  do {
    calcAnother = promptGetInput("\nDo you want to do the calculations for another loan? Answer with [(Y)es/(N)o].")
      .toLowerCase();
  } while (["", "\n"].includes(calcAnother) || !["y", "n", "yes", "no"].includes(calcAnother));
  keepRunning = (calcAnother[0] === "y");

  return keepRunning;
}

// -------- Main logic
function main() {
  prompt('--------- Loan calculator ------');

  while (true) {
    const { loanAmount,
      monthlyUserApr,
      loanDurationMonths } = queryAndValidateUser();
    const calcOutput = calcLoan(loanAmount, monthlyUserApr, loanDurationMonths);

    displayResults(loanDurationMonths, calcOutput);

    if (!shouldCalcAnother()) {
      console.log("\nGoodbye!\n");
      break;
    }
  }
}

main();
