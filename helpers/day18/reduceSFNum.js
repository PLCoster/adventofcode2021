const explodeSFNum = require('./explodeSFNum');
const splitSFNum = require('./splitSFNum');

/**
 * Reduces a given SnailFish Number by applying consecutive explosion
 * and splitting steps until no more can be performed.
 * @param {SnailFishNumber} num SF Num to be reduced
 * @returns {void} No return value, the SF Num is modified in place
 */
function reduceSFNum(num) {
  let reduced = false;
  while (!reduced) {
    // Try to explode, if we explode then we skip splitting:
    const exploded = explodeSFNum(num);
    if (exploded) if (exploded) continue;

    // If we can't split or explode we have finished reducing
    const split = splitSFNum(num);
    if (!split) reduced = true;
  }

  return;
}

// Test cases:
// const testNum1 = [
//   [
//     [[[4, 3], 4], 4],
//     [7, [[8, 4], 9]],
//   ],
//   [1, 1],
// ];
// const answer1 = JSON.stringify([
//   [
//     [[0, 7], 4],
//     [
//       [7, 8],
//       [6, 0],
//     ],
//   ],
//   [8, 1],
// ]);
// reduceSFNum(testNum1);
// console.log('Test 1: ', JSON.stringify(testNum1) === answer1);

module.exports = reduceSFNum;
