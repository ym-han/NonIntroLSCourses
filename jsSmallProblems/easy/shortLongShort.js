function shortLongShort(s1, s2) {
  let longer, shorter;
  [shorter, longer] = (s1.length < s2.length) ? [s1, s2] : [s2, s1]
  return shorter + longer + shorter;
}

console.log(shortLongShort('abc', 'defgh'));    // "abcdefghabc"
console.log(shortLongShort('abcde', 'fgh'));    // "fghabcdefgh"
console.log(shortLongShort('', 'xyz'));         // "xyz"
