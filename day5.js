/**
 * --- Day 5: Hydrothermal Venture ---
You come across a field of hydrothermal vents on the ocean floor! These vents constantly produce large, opaque clouds, so it would be best to avoid them if possible.

They tend to form in lines; the submarine helpfully produces a list of nearby lines of vents (your puzzle input) for you to review. For example:

0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
Each line of vents is given as a line segment in the format x1,y1 -> x2,y2 where x1,y1 are the coordinates of one end the line segment and x2,y2 are the coordinates of the other end. These line segments include the points at both ends. In other words:

An entry like 1,1 -> 1,3 covers points 1,1, 1,2, and 1,3.
An entry like 9,7 -> 7,7 covers points 9,7, 8,7, and 7,7.
For now, only consider horizontal and vertical lines: lines where either x1 = x2 or y1 = y2.

So, the horizontal and vertical lines from the above list would produce the following diagram:

.......1..
..1....1..
..1....1..
.......1..
.112111211
..........
..........
..........
..........
222111....

In this diagram, the top left corner is 0,0 and the bottom right corner is 9,9. Each position is shown as the number of lines which cover that point or . if no line covers that point. The top-left pair of 1s, for example, comes from 2,2 -> 2,1; the very bottom row is formed by the overlapping lines 0,9 -> 5,9 and 0,9 -> 2,9.

To avoid the most dangerous areas, you need to determine the number of points where at least two lines overlap. In the above example, this is anywhere in the diagram with a 2 or larger - a total of 5 points.

Consider only horizontal and vertical lines. At how many points do at least two lines overlap?
 */

const fs = require('fs');

// Load puzzle input:
const input = fs.readFileSync('input/day5.txt', 'utf-8').split('\n');

console.log(
  'Part 1 Answer: Number of overlapping horizontal/vertical vent positions:',
  mapVents(input)
);

/**
 * --- Part Two ---
Unfortunately, considering only horizontal and vertical lines doesn't give you the full picture; you need to also consider diagonal lines.

Because of the limits of the hydrothermal vent mapping system, the lines in your list will only ever be horizontal, vertical, or a diagonal line at exactly 45 degrees. In other words:

An entry like 1,1 -> 3,3 covers points 1,1, 2,2, and 3,3.
An entry like 9,7 -> 7,9 covers points 9,7, 8,8, and 7,9.
Considering all lines from the above example would now produce the following diagram:

1.1....11.
.111...2..
..2.1.111.
...1.2.2..
.112313211
...1.2....
..1...1...
.1.....1..
1.......1.
222111....
You still need to determine the number of points where at least two lines overlap. In the above example, this is still anywhere in the diagram with a 2 or larger - now a total of 12 points.

Consider all of the lines. At how many points do at least two lines overlap?
 */

console.log(
  'Part 2 Answer: Overlapping vent positions including diagonal vent lines: ',
  mapVents(input, false)
); // 18627

/**
 * Maps input to a map of ventlines and counts the number of locations
 * where vent lines overlap
 * @param {String[]} input Puzzle input with vent lines as strings
 * @param {Boolean} noDiag Set whether diagonal vent lines should be mapped or not (default not mapped)
 * @return {Number} Number of locations where more than one vent line exists
 */
function mapVents(input, noDiag = true) {
  const map = {};
  let overlapping = 0;

  // Iterate through vent line info:
  for (let i = 0; i < input.length; i += 1) {
    let [x1, y1, x2, y2] = input[i].split(/,| -> /).map((el) => parseInt(el));
    let incX, incY;

    // Determine how we need to increment x1 and y1 to reach x2 and y2
    if (x1 <= x2) {
      incX = 1;
    } else {
      incX = -1;
    }

    if (y1 <= y2) {
      incY = 1;
    } else {
      incY = -1;
    }

    // Consider only horizontal or vertical vent lines:
    if (noDiag && x1 !== x2 && y1 !== y2) {
      continue;
    }

    // Build map from vent line coords:
    while (true) {
      if (map[[x1, y1]] === 1) {
        overlapping += 1;
      }

      map[[x1, y1]] = map[[x1, y1]] || 0;
      map[[x1, y1]] += 1;

      // Run until we have mappped the entire vent line
      if (x1 === x2 && y1 === y2) {
        break;
      }

      if (x1 !== x2) {
        x1 += incX;
      }

      if (y1 !== y2) {
        y1 += incY;
      }
    }
  }

  return overlapping;
}

// const testInput = `0,9 -> 5,9
// 8,0 -> 0,8
// 9,4 -> 3,4
// 2,2 -> 2,1
// 7,0 -> 7,4
// 6,4 -> 2,0
// 0,9 -> 2,9
// 3,4 -> 1,4
// 0,0 -> 8,8
// 5,5 -> 8,2`.split('\n');

// console.log('Test output 1: ', mapVents(testInput)); // 5;
// console.log('Test output 2: ', mapVents(testInput, false)); // 12;
