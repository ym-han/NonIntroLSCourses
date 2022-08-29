/*
Rotation 1 PROMPT:
Write a function that rotates an array by moving the first element to the end of the array. Do not modify the original array.

If the input is not an array, return undefined.
If the input is an empty array, return an empty array.

INPUT: an array
OUTPUT: Union{undefined, array}

RULES / REQUIREMENTS:
* If input is not an array, return undefined
* If input is an empty array, return an empty array
* If input is a non-empty array:
  * return a copy of the array where the first element has been moved to the end of the array.
    * So, e.g., if input array only has one element, return array will be structurally equal
  * Do not modify the original array.

* Make sure that this will work with heterogeonous arrays with any kind of element

QUESTIONS:
* re 'empty array': can the input array contain empty slots?


ALGO:
1. If input is not an array, return undefined
2. If input is an empty array, return an empty array
3. If input is a non-empty array:
    * create a copy of the array,
    * a copy where the first element is now at the end of the array.
*/


// return `undefined` if the argument is not an array
rotateArray();                         // undefined
rotateArray(1);                        // undefined

// empty array ---> empty array
rotateArray([]);                       // []


console.log(
  rotateArray(['a'])[0] === "a"
);                    // ["a"]

console.log(
  rotateArray([7, 3, 5, 2, 9, 1])
);
// [3, 5, 2, 9, 1, 7]
console.log(
  rotateArray(['a', 'b', 'c']));
// ["b", "c", "a"]


rotateArray([1, 'a', 3, 'c']);         // ["a", 3, "c", 1]
rotateArray([{ a: 2 }, [1, 2], 3]);    // [[1, 2], 3, { a: 2 }]


// the input array is not mutated
// let array = [1, 2, 3, 4];
// rotateArray(array);                    // [2, 3, 4, 1]
// array;                                 // [1, 2, 3, 4]

function rotateArray(inArr) {
  // 1. If input is not an array, return undefined
  if (!Array.isArray(inArr)) {
    return undefined;
  }
  if (inArr.length === 0) {
    return [];
  }

  let copyArr = inArr.slice(1, inArr.length);
  copyArr.push(inArr[0]);
  return copyArr;
}


/* Rotation 2 Prompt:
Write a function that rotates the last count digits of a number.
To perform the rotation, move the first of the digits that you want to rotate to the end
and shift the remaining digits to the left.

INPUTS: number (# ), number (the last `count` digits to rotate)
OUTPUT: number (the rotated number)

Implicit requirements and properties:
* count` cannot be larger than the number of digits in the supplied number


QUESTIONS:
* What if the input num is a single number?
* What if the count digits input > num of digits in num?
* What if the supplied count digit === 0?
*/

function numDigitsInNum(num) {
  return String(num).length;
}


function rotateRightmostDigits(num, numDigits) {
  if (numDigits === 0) {
    return num;
  }
  if (numDigits > numDigitsInNum(num)) {
    console.log("`count` cannot be larger than the number of digits in the supplied number!");
    return undefined;
  }

  let numStr = String(num);
  let [partOfNumStrToRotate, constPartOfNumStr] = [numStr.slice(-numDigits),
    numStr.slice(0, numStr.length - numDigits)];

  let arrOfChars = partOfNumStrToRotate.split("");
  let rotatedPart = rotateArray(arrOfChars).join("");

  return Number(constPartOfNumStr + rotatedPart);
}

rotateRightmostDigits(12, 3);
rotateRightmostDigits(12, 0);

rotateRightmostDigits(735291, 1);      // 735291
rotateRightmostDigits(735291, 2);      // 735219
rotateRightmostDigits(735291, 3);      // 735912
rotateRightmostDigits(735291, 4);      // 732915
rotateRightmostDigits(735291, 5);      // 752913
rotateRightmostDigits(735291, 6);      // 352917


/* Rotation part 3
Take the number 735291 and rotate it by one digit to the left, getting 352917. Next, keep the first digit fixed in place and rotate the remaining digits to get 329175. Keep the first two digits fixed in place and rotate again to get 321759. Keep the first three digits fixed in place and rotate again to get 321597. Finally, keep the first four digits fixed in place and rotate the final two digits to get 321579. The resulting number is called the maximum rotation of the original number.

Write a function that takes an integer as an argument and returns the maximum rotation of that integer. You can (and probably should) use the rotateRightmostDigits function from the previous exercise.

Input: integer
Output: integer (the maxium rotation of the input integer)

Requirements
* If input num only has one digit, the maximum rotation is that input num
* If input num has two digits, then the output should be a number with those two digits flipped
* If the input num has three digits (d1 d2 d3), then the output num should be (d2 d1 d3);

* If the num that we're trying to rotate has a leading 0, we drop that leading 0, and fix the first non-leading-zero digit.

* the new digit that gets fixed is either the one immediately after the digit that was sent to the back or the one after a leading zero, prior to rotation.

123
> 231
> 213

1234
> 2341
> 2 | 413
> 24 | 31

Data structure: use array of chars
Algo:
* If there are leading zeroes in numCharArr, drop them
* Rotate array
* Again, remove leading zeroes if any
* Append the new first digit to the fixed part.
* If suffix's length > 1, repeat on suffix.

what is max rotation of 413?
413
> 134
> 1 | 43

8703529146
> 7035291468
> 7 | 352914680, from rotating array, fixing 7
> 73 | 29146805
> 732 | 1468059
> 7321 | 680594
> 73216 | 05948
> 732160 | 9485
> 7321609 | 854
> 73216098 | 45

Algo:
* Initial: If there are leading zeroes in numCharArr, drop them
* Rotate array
* If there are NO leading 0s:
  * Fix the first digit
 * Otherwise, if there are leading 0s, remove  them, and repeat from the top

* If suffix's length > 1, repeat on suffix.

Take aways:
* Need to work through test cases more carefully
* Make sure the pseudocode algo really does get the right predictions, 
  before starting to code 
*/


// What about maxRotation(0)?

function removeLeadingZeroes(numChars) {
  while (numChars[0] === "0") {
    numChars.shift();
  }
  return numChars;
}

function maxRotation(num) {
  let numLen = removeLeadingZeroes(String(num).split("")).length;

  if (numLen <= 2) {
    return rotateRightmostDigits(
      Number(removeLeadingZeroes(String(num).split("")).join("")), numLen);
  }

  // numLen > 2
  let suffix = removeLeadingZeroes(String(num).split(""));
  let prefix = [];

  while (true) {
    suffix = rotateArray(suffix);
    if (suffix[0] === '0') {
      suffix = removeLeadingZeroes(suffix);
      // do *not* fix the first non-0 digit.
      continue;
    }

    prefix.push(suffix.shift());
    if (suffix.length < 2) break;
  }

  return Number(prefix.join("") + suffix.join(""));
}

console.log(maxRotation(735291));          // 321579
maxRotation(3);               // 3
maxRotation(35);              // 53
maxRotation(105);             // WRONG 15 -- the leading zero gets dropped
maxRotation(8703529146);      // 7321609845
// maxRotation(1234);

/* the provided soln: 
function maxRotationSoln(number) {
  let numberDigits = String(number).length;
  for (let count = numberDigits; count >= 2; count--) {
    number = rotateRightmostDigits(number, count);
  }
  return number;
}
*/