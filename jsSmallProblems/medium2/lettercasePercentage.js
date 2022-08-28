/*
Input: string
Output:  object containing the following three properties:

the percentage of characters in the string that are lowercase letters
the percentage of characters that are uppercase letters
the percentage of characters that are neither

Requirements and rules:
* output percetages should be rounded to 2 decimal places
* the percentages should add up to 100.00

Data Structure:
Will want to work with array of characters

Algorithm:
1. Get the array of characters from the string
2. Count how many lowercase
3. Count how many uppercase
4. Count neither by doing total length - the above two numbers
5. Convert to percentages, package in an object, and return

Reflections:
* Doing this with regex would have been cleaner
*/
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const LOWERCASE_COND_FUNC = char => char.toLowerCase() === char;
const UPPERCASE_COND_FUNC = char => char.toUpperCase() === char;

function countNumCharsCondition(arrOfChars, conditionFunc) {
  return arrOfChars.filter(conditionFunc).length;
}

function convertToPercentageAndRound(count, total) {
  return ((count / total) * 100).toFixed(2); 
} 

function letterPercentages(str) {
  let charArr = str.split("");
  let letterCharArr = charArr.filter(char => ALPHABET.includes(char.toLowerCase()));
  let numLower = countNumCharsCondition(letterCharArr, LOWERCASE_COND_FUNC);
  let numUpper = countNumCharsCondition(letterCharArr, UPPERCASE_COND_FUNC);
  let numNeither = charArr.length - numLower - numUpper;
  return {
    lowercase: convertToPercentageAndRound(numLower, charArr.length),
    uppercase: convertToPercentageAndRound(numUpper, charArr.length),
    neither: convertToPercentageAndRound(numNeither, charArr.length)
  }
}

console.log(letterPercentages('abCdef 123'));
console.log(letterPercentages('AbCd +Ef'));
console.log(letterPercentages('123'));
