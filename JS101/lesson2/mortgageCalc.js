/* Mortage calculator

Assumptions
-----------
* loan amount and loan duration should be real numbers in (0, infinity).
* input loan duration should already be in months
* APR is percentage
  * Allow APR to be negative, so that users can use it to model 
real, as opposed to nominal, interest rates.
  * Use default APR if no APR is supplied 
*/

// -------- Key numbers
const readline = require('readline-sync');
const DEFAULT_APR = 5.0;

const APRInfoMessage = "Please supply the APR percentage rate; \
this should be ...."
const loanAmountInfoMessage = "Please supply the *loan amount*; \
this should be a real number in the open interval (0, infinity)."

const loanDurationInfoMessage = "Please supply the *loan duration*; \
this should be a real number in the open interval (0, infinity)."


let keepRunning = true;


// -------- Helper functions

const betweenZeroAndInf = num => num > 0 && num < Infinity;
const loanAmountFurtherValidation = betweenZeroAndInf; 
// change this if want to add further validation
const loanDurationFurtherValidation = betweenZeroAndInf;


function prompt(message) {
  console.log(`=> ${message}`);
}

function promptGetInput(message) {
  prompt(message);
  return readline.question();
}

// checks if supplied putative number is a Number
function validNumber(number) {
  return number.trimStart() !== '' && !Number.isNaN();
}

function repeatQueryValidMaker(message, nonBasicValidator) {
  let queriedNum, validNum;

  do {
    if (validNum === false) {
      prompt("Input invalid!\n")
    }

    queriedNum = Number(promptGetInput(message));
    validNum = [validNumber, nonBasicValidator].every(
      validator => validator(queriedNum)
    );
  } while (!validNum);

  return queriedNum;
}

const queryValidateLoanAmount = repeatQueryValidMaker(
  loanAmountInfoMessage,
  loanAmountFurtherValidation);
const queryValidateLoanDuration = repeatQueryValidMaker(
  loanDurationInfoMessage,
  loanDurationFurtherValidation);

function queryValidateApr() {

}

/* Computes and returns [loanAmount, userApr, loanDuration].
If user does not supply APR, userApr will be null.
The other values will not be null: user will be asked again for them if they
are not supplied.
*/
function queryAndValidateUser() {
  let userApr = null;
  userApr = queryValidateApr();

  let loanAmount = queryValidateLoanAmount();
  let loanDuration = queryValidateLoanDuration();

  return [loanAmount, userApr, loanDuration];
}


// -------- Main logic
prompt('--------- Loan calculator ------');

while (keepRunning) {
  /*
  1. Ask for loan amount, APR, and loan duration, 
     while informing user of the assumptions regarding these numbers.
  2. Validate these numbers; 
     ask again if user does not supply valid loan amount and duration.
  3. Calculate and tell user the monthly interest rate and loan duration in months
  4. Ask user if we want to repeat the process with another set of numbers;
     repeat (or not) accordingly
  */


  let loanAmount, userApr, loanDuration, monthlyInterestRate; 
  [loanAmount, userApr, loanDuration] = queryAndValidateUser();

  let monthlyInterestRate = computeMonthlyInterestRate(loanAmount, userApr, loanDuration);
  prompt(`The monthly interest rate is ${monthlyInterestRate}`);

}


