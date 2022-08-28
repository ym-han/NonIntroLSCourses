
/*
Inputs: 
an integer (that should be > 0)

Outputs: 
Outputs the message: The sum of the integers between 1 and the given integer is ...

Requiremnets:
* The given integer should be > 0
* The output sum / product should be that of all numbers between 1 and the integer, __inclusive__
*/

const readline = require("readline-sync");

// ask for integer
let suppliedInt;
while (true) {
  suppliedInt = parseInt(readline.question("Please enter an integer greater than 0\n"), 10);
  if (suppliedInt > 0) {
    break;
  } else {
    console.log("Integer must be greater than 0!");
  }
}

// Ask for whether sum or product
function makeArrayOfNumbers(int) {
  let retArr = [];
  for (let i = 1; i <= int; ++i) {
    retArr.push(i);
  }
  return retArr;
}

const performOp = op => makeArrayOfNumbers(suppliedInt).reduce((acc, curr) => op(acc, curr))

let userOpResp;
while (true) {
  userOpResp = readline.question('Enter "s" to compute the sum, or "p" to compute the product.\n');
  if (['s', 'p'].includes(userOpResp)) {
    break;
  } else {
    console.log("response should be an 's' or 'p'!");
  }
}


let opResult; 
if (userOpResp === 's') {
  opResult = performOp((a, b) => a + b);
  console.log(`The product of the integers between 1 and ${suppliedInt} is ${opResult}.`)
} else {
  opResult = performOp((a, b) => a * b);
  console.log(`The product of the integers between 1 and ${suppliedInt} is ${opResult}.`)
}
