/**
 * Looks for a number that should be split in a given SF number and if found,
 * splits the first example.
 * @param {SnailFishNumber} num SF Num to search for a value that should be split (single value > 9)
 * @param {[Boolean]} split Flag to track whether or not a split has been performed so far
 * @returns {Boolean} Whether or not a split was performed on the given SF Num
 */
function splitSFNum(num, split = [false]) {
  if (split[0]) {
    return;
  }

  for (let i = 0; i < num.length; i += 1) {
    // If we have already split, don't split again:
    if (split[0]) {
      break;
    }
    if (Array.isArray(num[i])) {
      splitSFNum(num[i], split);
    } else if (num[i] >= 10) {
      const left = Math.floor(num[i] / 2);
      const right = Math.ceil(num[i] / 2);
      num[i] = [left, right];
      split[0] = true;
    }
  }
  return split[0];
}

// Test Cases:
// const testNum1 = [10];
// const answer1 = JSON.stringify([[5, 5]]);
// splitSFNum(testNum1);
// console.log('Test 1: ', JSON.stringify(testNum1) === answer1);

// const testNum2 = [11];
// const answer2 = JSON.stringify([[5, 6]]);
// splitSFNum(testNum2);
// console.log('Test 2: ', JSON.stringify(testNum2) === answer2);

// const testNum3 = [12];
// const answer3 = JSON.stringify([[6, 6]]);
// splitSFNum(testNum3);
// console.log('Test 3: ', JSON.stringify(testNum3) === answer3);

// const testNum4 = [20, 14];
// const answer4 = JSON.stringify([[10, 10], 14]);
// splitSFNum(testNum4);
// console.log('Test 4: ', JSON.stringify(testNum4) === answer4);

module.exports = splitSFNum;
