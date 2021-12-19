const addSFNums = require('./addSFNums');
const reduceSFNum = require('./reduceSFNum');
const scoreSFNum = require('./scoreSFNum');

/**
 * Sums and reduces a list of SF Nums to a final SF Num and scores it
 * @param {SnailFishNums[]} numsList List of SnailFish Nums to be summed, reduced and scored
 * @returns {[SnailFishNum, Number]} Array containing the final reduced SF Num and its corresponding score
 */
function sumAndScoreSFNums(numsList) {
  let num = numsList[0];

  for (let i = 1; i < numsList.length; i += 1) {
    num = addSFNums(num, numsList[i]);
    reduceSFNum(num);
  }
  const numStr = JSON.stringify(num);
  return [numStr, scoreSFNum(num)];
}

// Test Cases
// const fs = require('fs');
// const path = require('path');

// const input1 = fs
//   .readFileSync(path.resolve(__dirname, '../../input/day18_test1.txt'), 'utf-8')
//   .split('\n')
//   .map((el) => JSON.parse(el));

// const result1 = sumAndScoreSFNums(input1)[0];
// console.log(
//   'Test1: ',
//   result1 ===
//     JSON.stringify([
//       [
//         [
//           [1, 1],
//           [2, 2],
//         ],
//         [3, 3],
//       ],
//       [4, 4],
//     ])
// );

// const input2 = fs
//   .readFileSync(path.resolve(__dirname, '../../input/day18_test2.txt'), 'utf-8')
//   .split('\n')
//   .map((el) => JSON.parse(el));

// const result2 = sumAndScoreSFNums(input2)[0];
// console.log(
//   'Test 2: ',
//   result2 ===
//     JSON.stringify([
//       [
//         [
//           [3, 0],
//           [5, 3],
//         ],
//         [4, 4],
//       ],
//       [5, 5],
//     ])
// );

// const input3 = fs
//   .readFileSync(path.resolve(__dirname, '../../input/day18_test3.txt'), 'utf-8')
//   .split('\n')
//   .map((el) => JSON.parse(el));

// const result3 = sumAndScoreSFNums(input3)[0];
// console.log(
//   'Test 3: ',
//   result3 ===
//     JSON.stringify([
//       [
//         [
//           [5, 0],
//           [7, 4],
//         ],
//         [5, 5],
//       ],
//       [6, 6],
//     ])
// );

// const input4 = fs
//   .readFileSync(path.resolve(__dirname, '../../input/day18_test4.txt'), 'utf-8')
//   .split('\n')
//   .map((el) => JSON.parse(el));

// const result4 = sumAndScoreSFNums(input4)[0];
// console.log(
//   'Test 4: ',
//   result4 ===
//     JSON.stringify([
//       [
//         [
//           [8, 7],
//           [7, 7],
//         ],
//         [
//           [8, 6],
//           [7, 7],
//         ],
//       ],
//       [
//         [
//           [0, 7],
//           [6, 6],
//         ],
//         [8, 7],
//       ],
//     ])
// );

// const input5 = fs
//   .readFileSync(path.resolve(__dirname, '../../input/day18_test.txt'), 'utf-8')
//   .split('\n')
//   .map((el) => JSON.parse(el));

// const answer5 = sumAndScoreSFNums(input5);
// const result5 = answer5[0];
// const score5 = answer5[1];
// console.log(
//   'Test 5 Result: ',
//   result5 ===
//     JSON.stringify([
//       [
//         [
//           [6, 6],
//           [7, 6],
//         ],
//         [
//           [7, 7],
//           [7, 0],
//         ],
//       ],
//       [
//         [
//           [7, 7],
//           [7, 7],
//         ],
//         [
//           [7, 8],
//           [9, 9],
//         ],
//       ],
//     ])
// );
// console.log('Test 5 Score: ', score5 === 4140);

module.exports = sumAndScoreSFNums;
