/**
 * Helper function that adds two SnailFish Numbers and returns the result
 * @param {SnailFishNum} num1 SnailFish Number 1
 * @param {SnailFishNum} num2 SnailFish Number 2
 * @returns Result of adding SnailFish Number 1 and 2
 */
function addSFNums(num1, num2) {
  return [num1, num2];
}

// Test cases:
// const testNum1 = [0, 9];
// const testNum2 = [5, 7];
// console.log(
//   'Test 1: ',
//   JSON.stringify(addSFNums(testNum1, testNum2)) === '[[0,9],[5,7]]'
// );

// const testNum3 = [1, 2];
// const testNum4 = [[3, 4], 5];
// console.log(
//   'Test 2: ',
//   JSON.stringify(addSFNums(testNum3, testNum4)) === '[[1,2],[[3,4],5]]'
// );

module.exports = addSFNums;
