/**
 * --- Day 24: Arithmetic Logic Unit ---
Magic smoke starts leaking from the submarine's arithmetic logic unit (ALU). Without the ability to perform basic arithmetic and logic functions, the submarine can't produce cool patterns with its Christmas lights!

It also can't navigate. Or run the oxygen system.

Don't worry, though - you probably have enough oxygen left to give you enough time to build a new ALU.

The ALU is a four-dimensional processing unit: it has integer variables w, x, y, and z. These variables all start with the value 0. The ALU also supports six instructions:

inp a - Read an input value and write it to variable a.
add a b - Add the value of a to the value of b, then store the result in variable a.
mul a b - Multiply the value of a by the value of b, then store the result in variable a.
div a b - Divide the value of a by the value of b, truncate the result to an integer, then store the result in variable a. (Here, "truncate" means to round the value toward zero.)
mod a b - Divide the value of a by the value of b, then store the remainder in variable a. (This is also called the modulo operation.)
eql a b - If the value of a and b are equal, then store the value 1 in variable a. Otherwise, store the value 0 in variable a.
In all of these instructions, a and b are placeholders; a will always be the variable where the result of the operation is stored (one of w, x, y, or z), while b can be either a variable or a number. Numbers can be positive or negative, but will always be integers.

The ALU has no jump instructions; in an ALU program, every instruction is run exactly once in order from top to bottom. The program halts after the last instruction has finished executing.

(Program authors should be especially cautious; attempting to execute div with b=0 or attempting to execute mod with a<0 or b<=0 will cause the program to crash and might even damage the ALU. These operations are never intended in any serious ALU program.)

For example, here is an ALU program which takes an input number, negates it, and stores it in x:

inp x
mul x -1
Here is an ALU program which takes two input numbers, then sets z to 1 if the second input number is three times larger than the first input number, or sets z to 0 otherwise:

inp z
inp x
mul z 3
eql z x
Here is an ALU program which takes a non-negative integer as input, converts it into binary, and stores the lowest (1's) bit in z, the second-lowest (2's) bit in y, the third-lowest (4's) bit in x, and the fourth-lowest (8's) bit in w:

inp w
add z w
mod z 2
div w 2
add y w
mod y 2
div w 2
add x w
mod x 2
div w 2
mod w 2
Once you have built a replacement ALU, you can install it in the submarine, which will immediately resume what it was doing when the ALU failed: validating the submarine's model number. To do this, the ALU will run the MOdel Number Automatic Detector program (MONAD, your puzzle input).

Submarine model numbers are always fourteen-digit numbers consisting only of digits 1 through 9. The digit 0 cannot appear in a model number.

When MONAD checks a hypothetical fourteen-digit model number, it uses fourteen separate inp instructions, each expecting a single digit of the model number in order of most to least significant. (So, to check the model number 13579246899999, you would give 1 to the first inp instruction, 3 to the second inp instruction, 5 to the third inp instruction, and so on.) This means that when operating MONAD, each input instruction should only ever be given an integer value of at least 1 and at most 9.

Then, after MONAD has finished running all of its instructions, it will indicate that the model number was valid by leaving a 0 in variable z. However, if the model number was invalid, it will leave some other non-zero value in z.

MONAD imposes additional, mysterious restrictions on model numbers, and legend says the last copy of the MONAD documentation was eaten by a tanuki. You'll need to figure out what MONAD does some other way.

To enable as many submarine features as possible, find the largest valid fourteen-digit model number that contains no 0 digits. What is the largest model number accepted by MONAD?
 */

/**
 * --- Part Two ---
As the submarine starts booting up things like the Retro Encabulator, you realize that maybe you don't need all these submarine features after all.

What is the smallest model number accepted by MONAD?
 */

// The ALU is a 4D processing unit, with integer variables:
// w, x, y, z

// It supports 6 instructions
// *  inp a - Read an input value and write it to variable a.
// * add a b - Add the value of a to the value of b, then store the result in variable a.
// * mul a b - Multiply the value of a by the value of b, then store the result in variable a.
// * div a b - Divide the value of a by the value of b, truncate the result to an integer, then store the result in variable a. (Here, "truncate" means to round the value toward zero.)
// * mod a b - Divide the value of a by the value of b, then store the remainder in variable a. (This is also called the modulo operation.)
// * eql a b - If the value of a and b are equal, then store the value 1 in variable a. Otherwise, store the value 0 in variable a.

// The MONAD input is a set of 14 instructions (one per digit), the set of instructions for each digit is very similar, with a few differences.
// The variable w is always set to the digit we are looking at
// The variable z is the only variable that carries onto the next digit
// x and y are reset to 0 before they are used for each digit, they are
// used merely for calculating the updated value of z

// For a model number to be valid we need z to be 0 after processing

// Analyzing the MONAD instructions, it can be seen that there are 18 instructions to perform for each of the 14 digits of the model number
// The 18 instructions for each digit are very similar, in fact the instructions only differ in 3 places for each digit:
// * Whether or not to divide z by 26 or 1 in the 5th instruction [1, 1, 1, 26, 1, 1, 1, 26, 26, 1, 26, 26, 26, 26]
// * The value to add to x in the 6th instruction [11, 10, 13, -10, 11, 11, 12, -11, -7, 13, -13, 0, -11, 0]
// * The value to add to y in the 16th instruction [1, 10, 2, 5, 6, 0, 16, 12, 15, 7, 6, 5, 6, 15]

// The overall effect of the instructions is to either:
// - Take the value of z , multiply it by 26 and add an additional value to it
// - Take the value of z, divide it by 26 (5th instruction = 26)
// In this sense we can see each digit as giving an instruction to either add or remove a digit from a base 26 number
// For a valid model number, z must be 0 after processing, this means the number of multiplications / divisions (or add/remove) opeartions must be equal

// Solver Takes about 2 seconds to complete
const result = solver();
console.log('Part 1 Answer: Maximum Valid Model Num: ', result[1]); // 89913949293989
console.log('Part 2 Answer: Minimum Valid Model Num: ', result[0]); // 12911816171712

// Test results individually using ALU
console.log('Part 1 Result Valid: ', runALU(result[1]) === 0); // Valid, returns 0
console.log('Part 2 Result Valid: ', runALU(result[0]) === 0); // Valid, returns 0

/**
 * Finds the minimum and maximum valid model numbers (z=0 after processing)
 * Modelled on https://github.com/SwampThingTom/AoC2021/blob/main/Python/24-ArithmeticLogicUnit/ArithmeticLogicUnit.py
 * @returns {[Number, Number]} The minimum and maximum valid model numbers
 */
function solver() {
  let zStates = { 0: [Infinity, 0] };
  const maxZ = [null, 7, 7, 7, 6, 6, 6, 6, 5, 4, 4, 3, 2, 1, 0];
  for (let i = 1; i < 15; i += 1) {
    const zMax = 26 ** maxZ[i]; // Optimised for specific input
    // const zMax = Math.min(26 ** 7, 26 ** (14 - i)); // Works on any input
    // z is increased or reduced by a factor of 26 on each input
    // There are only seven possible decreases so zMax can be at most 26 ** 7
    // If we want z to return to 0 by the last digit
    zStates = findNextZStates(i - 1, zStates, zMax);
  }

  // We are only interested in the final states where z is 0
  return zStates[0];
}

/**
 * Determines all the next possible values of z given the previous z values
 * @param {Number} digitIndex The digit of the model number we are processing
 * @param {{[key : string]: [Number, Number]}} prevStates Object with keys of previous z values possible,
 * and values of an array containing the minimum and maximum model number that generated the z value.
 * @param {Number} zMax The maximum value of z that can still lead to a valid model number
 * @returns {{[key : string]: [Number, Number]}} Updated z states after processing the current digit
 */
function findNextZStates(digitIndex, prevStates, zMax) {
  const newStates = {};
  // Iterate through all possible values of z we can produce
  Object.keys(prevStates).forEach((prevZ) => {
    prevModelNums = prevStates[prevZ];
    // Generate all possible new z values / model numbers from this z state
    const digitStates = runAllDigits(digitIndex, prevZ, zMax, prevModelNums);
    for (let i = 0; i < digitStates.length; i += 1) {
      // Create initial state for the new z values
      const [newZ, newMin, newMax] = digitStates[i];
      newStates[newZ] = newStates[newZ] || [Infinity, 0];
      const [oldMin, oldMax] = newStates[newZ];
      // Keep only the minimum and maximum model nums that generate this z state
      newStates[newZ] = [Math.min(oldMin, newMin), Math.max(oldMax, newMax)];
    }
  });
  // Return new z_states after exploring all posibilities for this digit
  return newStates;
}

/**
 * Generates all possible new z values and model numbers when processing the next digit from a given z value
 * @param {Number} digitIndex The index of the model number digit we are processing
 * @param {Number} prevZ The z value before processing the current digit
 * @param {Number} zMax The maximum z value that could still lead to a valid model number
 * @param {[Number, Number]} prevModelNums The minimum and maxiumum model numbers that produced the previous z value
 * @returns {[Number, Number, Number][]} Array containing arrays of [new z value, minimum model number, maximum model number]
 */
function runAllDigits(digitIndex, prevZ, zMax, prevModelNums) {
  const digitStates = [];
  for (let digit = 1; digit < 10; digit += 1) {
    const newZ = runALUOnDigit(digitIndex, digit, prevZ);
    if (newZ <= zMax) {
      const minNum =
        prevModelNums[0] === Infinity ? digit : prevModelNums[0] * 10 + digit;
      const maxNum = prevModelNums[1] * 10 + digit;
      digitStates.push([newZ, minNum, maxNum]);
    }
  }
  return digitStates;
}

/**
 * Generates the next value of Z given an input digit, the index of the digit in the model number,
 * and the previous z value.
 * @param {Number} digitIndex
 * @param {Number} digit
 * @param {Number} prevZ
 * @returns {Number} The next value of z after processing the given digit through the ALU.
 */
function runALUOnDigit(digitIndex, digit, prevZ) {
  // Hand-derived instruction variables:
  // On each digit we either remove one digit from z in base 26, or not (1)
  const div = [1, 1, 1, 26, 1, 1, 1, 26, 26, 1, 26, 26, 26, 26];
  const addX = [11, 10, 13, -10, 11, 11, 12, -11, -7, 13, -13, 0, -11, 0];
  const addY = [1, 10, 2, 5, 6, 0, 16, 12, 15, 7, 6, 5, 6, 15];

  let z = prevZ;
  let w = digit;
  let x = (z % 26) + addX[digitIndex] === w ? 0 : 1; // x is either 1 or 0
  z = parseInt(z / div[digitIndex]); // z is either reduced by 1 digit in base 26 or not
  let y = 25 * x + 1; // y is either 26 or 1
  z *= y; // z is increased by a factor of 26 or stays the same
  y = (w + addY[digitIndex]) * x; // y is now either w + addY[i] or 0
  z += y;

  return z;
}

// ** INITIAL BRUTE FORCE APPROACH - NOT A VIABLE STRATEGY!! **
// console.log('Part 1: Highest Accepted Model Number: ', bruteForce());

/**
 * Brute force iteration through all possible model numbers to find the maximum valid model number
 * @returns Maximum Valid model number
 */
function bruteForce() {
  let num = 99999999999999;

  while (num > 0) {
    const result = runALU(num);
    if (result === 0) {
      return result;
    }
    num -= 1;
    if (num % 1000000 === 0) {
      console.log('Checked nums down to: ', num);
    }
  }
}

/**
 * Runs full set of ALU instructions on a given model Number and returns the final value of z
 * @param {Number} modelNum 14 digit model number
 * @returns {Number} Final value of z after processing the 14 digits of the model number
 */
function runALU(modelNum) {
  const digits = modelNum
    .toString()
    .split('')
    .map((char) => parseInt(char));

  if (digits.length !== 14 || digits.includes(0)) {
    return 1;
  }
  // Hand-derived instruction variables:
  // On each digit we either remove one digit from z in base 26, or not (1)
  const div = [1, 1, 1, 26, 1, 1, 1, 26, 26, 1, 26, 26, 26, 26];
  const addX = [11, 10, 13, -10, 11, 11, 12, -11, -7, 13, -13, 0, -11, 0];
  const addY = [1, 10, 2, 5, 6, 0, 16, 12, 15, 7, 6, 5, 6, 15];

  let z = 0;
  for (let i = 0; i < 14; i += 1) {
    let initZ = 0;
    let w = digits[i];
    let x = (z % 26) + addX[i] === w ? 0 : 1; // x is either 1 or 0
    z = parseInt(z / div[i]); // z is either reduced by 1 digit in base 26 or not
    let y = 25 * x + 1; // y is either 26 or 1
    z *= y; // z is increased by a factor of 26 or stays the same
    y = (w + addY[i]) * x; // y is now either w + addY[i] or 0
    z += y;
  }
  return z;
}
