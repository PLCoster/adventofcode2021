/**
 * Calculates the magnitude score of a given SF Number
 * @param {SnailFishNumber} num SnailFish Number to have its magnitude scored
 * @returns {Number} Score for given SnailFish Number
 */
function scoreSFNum(num) {
  // Reduce scores down until we are left with a single pair
  while (typeof num[0] !== 'number' || typeof num[1] !== 'number') {
    reduceScores(num);
  }

  // Converts all pairs found to corresponding scores
  function reduceScores(num) {
    for (let i = 0; i < num.length; i += 1) {
      if (Array.isArray(num[i])) {
        if (
          num[i].length === 2 &&
          typeof num[i][0] === 'number' &&
          typeof num[i][1] === 'number'
        ) {
          num[i] = 3 * num[i][0] + 2 * num[i][1];
        } else {
          reduceScores(num[i]);
        }
      }
    }
  }
  return num[0] * 3 + num[1] * 2;
}

// Test Cases:
// console.log('Test 1: ', scoreSFNum([9, 1]) === 29);
// console.log('Test 2: ', scoreSFNum([1, 9]) === 21);
// console.log(
//   'Test 3: ',
//   scoreSFNum([
//     [9, 1],
//     [1, 9],
//   ]) === 129
// );
// console.log(
//   'Test 4: ',
//   scoreSFNum([
//     [
//       [
//         [8, 7],
//         [7, 7],
//       ],
//       [
//         [8, 6],
//         [7, 7],
//       ],
//     ],
//     [
//       [
//         [0, 7],
//         [6, 6],
//       ],
//       [8, 7],
//     ],
//   ]) === 3488
// );
// console.log(
//   'Test 5: ',
//   scoreSFNum([
//     [
//       [
//         [6, 6],
//         [7, 6],
//       ],
//       [
//         [7, 7],
//         [7, 0],
//       ],
//     ],
//     [
//       [
//         [7, 7],
//         [7, 7],
//       ],
//       [
//         [7, 8],
//         [9, 9],
//       ],
//     ],
//   ]) === 4140
// );

module.exports = scoreSFNum;
