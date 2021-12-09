/**
 * Deduces the output digits for each line of input, transforms the output into a number and returns the sum of all outputs.
 * @param {String[]} input puzzle input split into signal values and output values by even/odd indices:
 * @return {Number} Returns the sum of all outputs after deduction
 */
function deduceAndSum(input) {
  let sum = 0;

  for (let i = 0; i < input.length; i += 2) {
    const signals = input[i].split(' ');
    const output = input[i + 1].split(' ');

    // Deduce encodings, generate output and add it to sum:
    const dict = deduceDigits(signals);
    const result = parseInt(
      output.map((el) => dict[el.split('').sort().join('')]).join('')
    );
    sum += result;
  }

  return sum;
}

/**
 * Helper function that deduces and returns the segment encoding corresponding to each digit, for a given sequence of signal values.
 * @param {String[]} signalVals Input set of 10 encoded signal value strings corresponding to digits 0-9
 * @returns {{[index: String]: number}} Deduced encodings of each signal string to a numerical digit 0-9
 */
function deduceDigits(signalVals) {
  // Load given input into a dictionary to store final results, sorting segment input alphabetically
  signalVals = signalVals.map((el) => el.split('').sort().join(''));

  const seqToNums = signalVals.reduce((accum, el) => {
    accum[el] = null;
    return accum;
  }, {});

  const numsToSeq = {};
  const segmentEncodings = {};

  // Basic deductions of 1, 4, 7, 8:
  for (let i = 0; i < signalVals.length; i += 1) {
    const seq = signalVals[i];
    if (seq.length === 2) {
      seqToNums[seq] = 1;
      numsToSeq[1] = seq;
    } else if (seq.length === 4) {
      seqToNums[seq] = 4;
      numsToSeq[4] = seq;
    } else if (seq.length === 3) {
      seqToNums[seq] = 7;
      numsToSeq[7] = seq;
    } else if (seq.length === 7) {
      seqToNums[seq] = 8;
      numsToSeq[8] = seq;
    }
  }

  // Apply deduction - '7' minus '1' gives 'a' segment:
  segmentEncodings['a'] = subtractSequence(numsToSeq[7], numsToSeq[1])[0];

  // Three 6-segment digits: '6', '9', '0'
  // '8' minus '6' leaves only segment 'c', which is in '1':
  // '8' minus '0' leaves only segment 'd' which is in '4', but not in '1'
  for (let i = 0; i < signalVals.length; i += 1) {
    const seq = signalVals[i];
    if (seq.length === 6) {
      const diff = subtractSequence(numsToSeq[8], seq).join('');
      if (numsToSeq[1].includes(diff)) {
        numsToSeq[6] = seq;
        segmentEncodings['c'] = diff;
        seqToNums[seq] = 6;
      } else if (!numsToSeq[1].includes(diff) && numsToSeq[4].includes(diff)) {
        numsToSeq[0] = seq;
        segmentEncodings['d'] = diff;
        seqToNums[seq] = 0;
      } else {
        numsToSeq[9] = seq;
        segmentEncodings['e'] = diff;
        seqToNums[seq] = 9;
      }
    }
  }

  // Number 1 minus segment c gives us segment f:
  segmentEncodings['f'] = subtractSequence(
    numsToSeq[1],
    segmentEncodings['c']
  )[0];

  // Number 4 minus (1 + segment d) gives segment b:
  segmentEncodings['b'] = subtractSequence(
    numsToSeq[4],
    numsToSeq[1] + segmentEncodings['d']
  )[0];

  // We now have nums 0, 1, 4, 6, 7, 9 ID'd, just need 2, 3 , 5
  // 5 includes segment b
  // 2 includes segment e
  for (let i = 0; i < signalVals.length; i += 1) {
    const seq = signalVals[i];
    if (seq.length === 5) {
      if (seq.includes(segmentEncodings['b'])) {
        numsToSeq[5] = seq;
        seqToNums[seq] = 5;
      } else if (seq.includes(segmentEncodings['e'])) {
        numsToSeq[2] = seq;
        seqToNums[seq] = 2;
      } else {
        numsToSeq[3] = seq;
        seqToNums[seq] = 3;
      }
    }
  }

  // Return the encoding of segments to each digit:
  return seqToNums;
}

/**
 * Helper function to return set difference between two segment sequences
 * @param {String} seq1 String sequence of lit segments
 * @param {String} seq2 String sequence of lit segments
 * @return {String[]} Set of chars remaining after calculating Set difference seq1 - seq2
 */
function subtractSequence(seq1, seq2) {
  return [...seq1].filter((char) => !seq2.includes(char));
}

// const testInput =
//   'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'.split(
//     ' | '
//   );
// console.log(deduceAndSum(testInput)); // 5353

module.exports = deduceAndSum;
