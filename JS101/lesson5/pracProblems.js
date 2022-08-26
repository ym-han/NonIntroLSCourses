// prac problem 5
let munsters = {
  Herman: { age: 32, gender: 'male' },
  Lily: { age: 30, gender: 'female' },
  Grandpa: { age: 402, gender: 'male' },
  Eddie: { age: 10, gender: 'male' },
  Marilyn: { age: 23, gender: 'female'}
};

function sum(arr) {
  return arr.reduce((acc, curr) => acc + curr, 0)
}

sum(Object.values(munsters).filter(person => person.gender === 'male').map(person => person.age))


// prac problem 6
Object.entries(munsters).forEach(pair => {
    console.log(`${pair[0]} is a ${pair[1].age}-year-old ${pair[1].gender}`)
  }
)

// 10: Sort in descending order
let arr = [['b', 'c', 'a'], [2, 11, -3], ['blue', 'black', 'green']];

arr.map(subArr => {
  if (typeof subArr[0] === 'string') {
    // we have an array of strings
    return subArr.slice().sort((a, b) => a < b ? 1 : -1 );
  } else {
    // we have an array of numbers
    return subArr.slice().sort((a, b) => b - a);
  }
});


/* 11. Given the following data structure, 
use the map method to return a new array identical in structure to the original 
but, with each number incremented by 1. Do not modify the original data structure.
*/
let arr = [{ a: 1 }, { b: 2, c: 3 }, { d: 4, e: 5, f: 6 }];
arr.map(obj => Object.entries(obj).map(pair => [pair[0], pair[1] + 1]))


let arr = [[2], [3, 5, 7], [9], [11, 15, 18]];
arr.map(subArr => subArr.filter(num => num % 3 === 0));


// 15.
let arr = [
  { a: [1, 2, 3] },
  { b: [2, 4, 6], c: [3, 6], d: [4] },
  { e: [8], f: [6, 10] },
];

arr.filter(o => Object.values(o).flat().every(num => num % 2 === 0))

