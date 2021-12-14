/**
 * --- Day 14: Extended Polymerization ---
The incredible pressures at this depth are starting to put a strain on your submarine. The submarine has polymerization equipment that would produce suitable materials to reinforce the submarine, and the nearby volcanically-active caves should even have the necessary input elements in sufficient quantities.

The submarine manual contains instructions for finding the optimal polymer formula; specifically, it offers a polymer template and a list of pair insertion rules (your puzzle input). You just need to work out what polymer would result after repeating the pair insertion process a few times.

For example:

NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
The first line is the polymer template - this is the starting point of the process.

The following section defines the pair insertion rules. A rule like AB -> C means that when elements A and B are immediately adjacent, element C should be inserted between them. These insertions all happen simultaneously.

So, starting with the polymer template NNCB, the first step simultaneously considers all three pairs:

The first pair (NN) matches the rule NN -> C, so element C is inserted between the first N and the second N.
The second pair (NC) matches the rule NC -> B, so element B is inserted between the N and the C.
The third pair (CB) matches the rule CB -> H, so element H is inserted between the C and the B.
Note that these pairs overlap: the second element of one pair is the first element of the next pair. Also, because all pairs are considered simultaneously, inserted elements are not considered to be part of a pair until the next step.

After the first step of this process, the polymer becomes NCNBCHB.

Here are the results of a few steps using the above rules:

Template:     NNCB
After step 1: NCNBCHB
After step 2: NBCCNBBBCBHCB
After step 3: NBBBCNCCNBBNBNBBCHBHHBCHB
After step 4: NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB
This polymer grows quickly. After step 5, it has length 97; After step 10, it has length 3073. After step 10, B occurs 1749 times, C occurs 298 times, H occurs 161 times, and N occurs 865 times; taking the quantity of the most common element (B, 1749) and subtracting the quantity of the least common element (H, 161) produces 1749 - 161 = 1588.

Apply 10 steps of pair insertion to the polymer template and find the most and least common elements in the result. What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?
 */

// Load Inputs:
const fs = require('fs');

// const testInput = fs.readFileSync('./input/day14_test.txt', 'utf-8');
// console.log(runSimulation(testInput, 10)); // 1588

const input = fs.readFileSync('./input/day14.txt', 'utf-8');
console.log(
  'Part 1 Answer: Count of Max el minus count of min el after 10 steps: ',
  runSimulationBF(input, 10)
); // 2657

/**
 * Parses puzzle input into the initial polymer template, and set of rules for polymerisation.
 * @param {String} input Raw puzzle input as string
 * @returns {[String, {[key: string]: string}]} Array containing the polymer template string, and
 * and object where keys are pairs of elements, and values are the element to place between the pair
 * during polymerisation.
 */
function parseInput(input) {
  const [template, rules] = input.split('\n\n');
  const ruleObj = rules
    .split('\n')
    .map((el) => el.split(' -> '))
    .reduce((accum, [start, end]) => {
      accum[start] = end;
      return accum;
    }, {});
  return [template, ruleObj];
}

/**
 * Brute force way to insert pairs. Falls down when steps gets too large because the resulting template array gets enormous.
 * @param {String} template Initial polymer template string
 * @param {{[key: string]: string}} ruleObj Object containing the polymerisation rules - which element to insert inside a pair.
 * @param {Number} steps Number of polymerisation steps to run.
 * @returns {String[]} The final polymer after polymerisation as an array of elements.
 */
function insertPairsBF(template, ruleObj, steps) {
  let templateArr = template.split('');

  // Run insertion for given number of steps
  for (let i = 0; i < steps; i += 1) {
    // On each insertion look at all pairs in template and add insert given element between them:
    const newTemplate = [];
    for (let j = 0; j < templateArr.length - 1; j += 1) {
      newTemplate.push(templateArr[j]);
      const pair = templateArr[j] + templateArr[j + 1];
      if (pair in ruleObj) {
        newTemplate.push(ruleObj[pair]);
      }
    }

    // Push last element into new Template:
    newTemplate.push(templateArr[templateArr.length - 1]);

    // Update template and element counts for next round
    templateArr = newTemplate;
  }
  return templateArr;
}

/**
 * Runs full simulation using brute force polymerisation function.
 * @param {String} input Raw puzzle input as a string
 * @param {Number} steps Number of steps to run polymerisation for.
 * @returns {Number} Difference between the count of most common and least common elements after polymerisation.
 */
function runSimulationBF(input, steps) {
  const [template, ruleObj] = parseInput(input);
  const polyString = insertPairsBF(template, ruleObj, steps);

  // Count elements in polyString
  const elCounts = {};
  for (let i = 0; i < polyString.length; i += 1) {
    const char = polyString[i];
    elCounts[char] = elCounts[char] || 0;
    elCounts[char] += 1;
  }

  // Return max elCount - min elCount:
  const max = Math.max(...Object.values(elCounts));
  const min = Math.min(...Object.values(elCounts));

  return max - min;
}

/**
 * --- Part Two ---
The resulting polymer isn't nearly strong enough to reinforce the submarine. You'll need to run more steps of the pair insertion process; a total of 40 steps should do it.

In the above example, the most common element is B (occurring 2192039569602 times) and the least common element is H (occurring 3849876073 times); subtracting these produces 2188189693529.

Apply 40 steps of pair insertion to the polymer template and find the most and least common elements in the result. What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?
 */

// console.log(runSimulation(testInput, 40)); // 2188189693529

console.log(
  'Part 2 Answer: Count of Max el minus count of min el after 40 steps: ',
  runSimulation(input, 40)
); // 2911561572630

/**
 * Function to more efficiently simulate the polymerisation by keeping track of element pair counts only, not the entire polymer.
 * @param {String} template Initial polymer template string
 * @param {{[key: string]: string}} ruleObj Object containing the polymerisation rules - which element to insert inside a pair.
 * @param {Number} steps Number of polymerisation steps to run.
 * @returns {{[key: string] : Number}} Object with keys of element pairs, and values of the number of such pairs in the final polymer.
 */
function insertPairs(template, ruleObj, steps) {
  // Count pairs from template into object:
  let pairCounts = {};
  for (let i = 0; i < template.length - 1; i += 1) {
    const pair = template[i] + template[i + 1];
    pairCounts[pair] = pairCounts[pair] || 0;
    pairCounts[pair] += 1;
  }

  // Run insertion for given number of steps
  for (let i = 0; i < steps; i += 1) {
    // On each insertion look at all pairs in template and add insert given element between them:
    const newPairCounts = {};
    Object.keys(pairCounts).forEach((pair) => {
      const newEl = ruleObj[pair];
      // Create two new pairs from current pair and increment their counts
      newPairCounts[pair[0] + newEl] = newPairCounts[pair[0] + newEl] || 0;
      newPairCounts[pair[0] + newEl] += pairCounts[pair];

      newPairCounts[newEl + pair[1]] = newPairCounts[newEl + pair[1]] || 0;
      newPairCounts[newEl + pair[1]] += pairCounts[pair];
    });

    // Update template and element counts for next round
    pairCounts = newPairCounts;
  }
  return pairCounts;
}

/**
 * Runs full simulation using more efficient pair counting method.
 * @param {String} input Raw puzzle input as a string
 * @param {Number} steps Number of steps to run polymerisation for.
 * @returns {Number} Difference between the count of most common and least common elements after polymerisation.
 */
function runSimulation(input, steps) {
  const [template, ruleObj] = parseInput(input);
  const pairCounts = insertPairs(template, ruleObj, steps);

  // Count elements in pairCounts
  const elCounts = {};
  Object.keys(pairCounts).forEach((pair) => {
    elCounts[pair[0]] = elCounts[pair[0]] || 0;
    elCounts[pair[0]] += pairCounts[pair];
    elCounts[pair[1]] = elCounts[pair[1]] || 0;
    elCounts[pair[1]] += pairCounts[pair];
  });

  // Since we are counting pairs, we have counted each element 2x, apart from the first and last element in the polyString template.
  // Add 1 to these element counts, then divide all by 2 to get their actual element counts in the final string:
  elCounts[template[0]] += 1;
  elCounts[template[template.length - 1]] += 1;

  // Return max elCount - min elCount:
  const max = Math.max(...Object.values(elCounts)) / 2;
  const min = Math.min(...Object.values(elCounts)) / 2;

  return max - min;
}
