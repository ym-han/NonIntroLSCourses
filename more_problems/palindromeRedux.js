/*
INPUT: number, number (start, len)
OUTPUT: array (the array of length `len` of palindromes that are >= `start`)

REQUIREMENTS:
Key idea: want to return length `len` array of palindromes that are >= `start`

Re palindrome:
* A number whose string, when reversed, is the same as the string version of the original number.
* Single digits are NOT palindromes

--- Well-formedness requirements on inputs:
* The two inputs have to each be numbers: 
  if that's not the case, return string "Not valid"
* The `len` arg should be >= 0; if it's not, return "Not valid"
* The `start` arg should be >= 0; if not, return "Not valid"

--- Outputs:
* Output array should be sorted in ascending order
* Output array can be empty array 


DATA STRUCTURE: arrays

ALGO:



*/

/* --- isPalindrome :: number -> boolean

Assumes that the input is well-formed; i.e., that it's a number
Returns true iff the input is a palindrome; 
i.e., is a number that is not a single digit, and whose string, when reversed, is the same as the string version of the original number.
*/
function isPalindrome(num) {
  let numStr = String(num);
  if (numStr.length === 1) return false;
  let reversedNumStr = numStr.split("").reverse().join("");

  return reversedNumStr == num;
}

console.log(isPalindrome(0) === false);
console.log(isPalindrome(5) === false);
console.log(isPalindrome(15) === false);
console.log(isPalindrome(22) === true);
console.log(isPalindrome(232) === true);



/*
--- Check for well-formedness
1. If the two inputs aren't each numbers, return "Not valid"
2a. The `len` arg should be >= 0; if it's not, return "Not valid"
 b. The `start` arg should be >= 0; if not, return "Not valid"
3. Build up palindromes as described below

*/
function palindrome(start, len) {
  // 1. Check if input well-formed
  // a.  If the two inputs aren't each numbers, return "Not valid"
  if (typeof start !== "number" || typeof len !== "number") return "Not valid";
  
  // 2a. The `len` arg should be >= 0; if it's not, return "Not valid"
  // b. The `start` arg should be >= 0; if not, return "Not valid"
  if (!(start >= 0 && len >= 0)) return "Not valid";

  //   ---- Main algo / algo for building up palindromes
  // One way: Incremnetally build array of palindromes till reach desired length (length === `len`)
  // That is:
  // * Make auxiliary `ret` array
  // * Increment, starting from `start`: 
  //   * Every time we get an integer that is a palindrome, append it to `ret`
  //   * Stop once `ret` reaches desired length (len === `len`)
  // * Return `ret`
  let ret = [];
  let i = start;
  while (ret.length < len) {
    if (isPalindrome(i)) ret.push(i);
    i++;
  }
  return ret;
}


console.log(palindrome(6, 4));
// [11,22,33,44]
console.log(palindrome(75, 1));
// [77]
console.log(palindrome(101, 2));
// [101,111]
console.log(palindrome(20, 0));
// []
console.log(palindrome(0, 4));
// [11,22,33,44]

console.log(palindrome("ACCDDCCA", 3));
console.log(palindrome(3, "ACCDDCCA"));
// // "Not valid"
// console.log(palindrome(773, "1551"));
// // "Not valid"
console.log(palindrome(-4505, 15));
// // "Not valid"

console.log(palindrome(4505, -15));
// // "Not valid"



