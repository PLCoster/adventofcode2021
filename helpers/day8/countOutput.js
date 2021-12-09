/**
 * Counts the number of 1, 4, 7, 8 digits in the output section of the input
 * @param {String[]} input puzzle input split into signal values and output values by even/odd indices:
 * @return {Number} Returns the number of counts of 1, 4, 7, or 8 in the output
 */
function countOutput(input) {
  let numCounts = 0;
  let lengths = [2, 3, 4, 7];
  for (let i = 1; i < input.length; i += 2) {
    const output = input[i].split(' ');
    for (let j = 0; j < output.length; j += 1) {
      if (lengths.includes(output[j].length)) {
        numCounts += 1;
      }
    }
  }

  return numCounts;
}

module.exports = countOutput;
