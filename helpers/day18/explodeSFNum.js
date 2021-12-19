/**
 * Finds and explodes the first instance of a SF Num that should be exploded,
 * if present in the SF Num.
 * @param {SnailFishNumber} num SnailFish Number to attempt to perform explode operation on
 * @returns {Boolean} Whether or not an explode operation was performed on the SF Num
 */
function explodeSFNum(num) {
  let prevArray = null;
  let prevNumInd = null;
  let nextArray = null;
  let nextNumInd = null;
  let exploded;
  let leftVal;
  let rightVal;

  function explodeHelper(num, depth = 0) {
    // If we have exploded and found the number to the right, we can skip the rest of the number
    if (exploded && nextArray !== null) {
      return;
    }

    // Iterate through number array, keep track of the last value to the left we find until we find a number pair to explode
    for (let i = 0; i < num.length; i += 1) {
      if (exploded && nextArray !== null) {
        break;
      }

      if (Array.isArray(num[i])) {
        // If current depth is not 3 or we have already exploded, the subarray is not valid for exploding, recursively parse it:
        if (depth !== 3 || exploded) {
          explodeHelper(num[i], depth + 1);
        }
        // Otherwise this array is valid to explode, if it contains two numbers:
        else {
          leftVal = num[i][0];
          rightVal = num[i][1];
          num[i] = 0;
          exploded = true;
        }
        // Otherwise current value is a number
      } else {
        // If not yet exploded keep track of last number seen
        if (!exploded) {
          prevArray = num;
          prevNumInd = i;
        } else if (nextArray === null) {
          // Track next number to the right of exploded pair
          nextArray = num;
          nextNumInd = i;
        }
      }
    }
  }
  explodeHelper(num);
  // Add exploded numbers to the numbers to the left and right:
  if (exploded) {
    if (prevArray) {
      prevArray[prevNumInd] += leftVal;
    }
    if (nextArray) {
      nextArray[nextNumInd] += rightVal;
    }
    return true;
  }

  return false;
}

// Test Cases:
// const testNum1 = [[[[[9, 8], 1], 2], 3], 4];
// const answer1 = JSON.stringify([[[[0, 9], 2], 3], 4]);
// explodeSFNum(testNum1);
// console.log('Test case 1: ', JSON.stringify(testNum1) === answer1);

// const testNum2 = [7, [6, [5, [4, [3, 2]]]]];
// const answer2 = JSON.stringify([7, [6, [5, [7, 0]]]]);
// explodeSFNum(testNum2);
// console.log('Test case 2: ', JSON.stringify(testNum2) === answer2);

// const testNum3 = [[6, [5, [4, [3, 2]]]], 1];
// const answer3 = JSON.stringify([[6, [5, [7, 0]]], 3]);
// explodeSFNum(testNum3);
// console.log('Test case 3: ', JSON.stringify(testNum3) === answer3);

// const testNum4 = [
//   [3, [2, [1, [7, 3]]]],
//   [6, [5, [4, [3, 2]]]],
// ];
// const answer4 = JSON.stringify([
//   [3, [2, [8, 0]]],
//   [9, [5, [4, [3, 2]]]],
// ]);
// explodeSFNum(testNum4);
// console.log('Test case 4: ', JSON.stringify(testNum4) === answer4);

// const testNum5 = [
//   [3, [2, [8, 0]]],
//   [9, [5, [4, [3, 2]]]],
// ];
// const answer5 = JSON.stringify([
//   [3, [2, [8, 0]]],
//   [9, [5, [7, 0]]],
// ]);
// explodeSFNum(testNum5);
// console.log('Test case 5: ', JSON.stringify(testNum5) === answer5);

module.exports = explodeSFNum;
