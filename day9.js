/**
 * --- Day 9: Smoke Basin ---
These caves seem to be lava tubes. Parts are even still volcanically active; small hydrothermal vents release smoke into the caves that slowly settles like rain.

If you can model how the smoke flows through the caves, you might be able to avoid it and be that much safer. The submarine generates a heightmap of the floor of the nearby caves for you (your puzzle input).

Smoke flows to the lowest point of the area it's in. For example, consider the following heightmap:

2199943210
3987894921
9856789892
8767896789
9899965678
Each number corresponds to the height of a particular location, where 9 is the highest and 0 is the lowest a location can be.

Your first goal is to find the low points - the locations that are lower than any of its adjacent locations. Most locations have four adjacent locations (up, down, left, and right); locations on the edge or corner of the map have three or two adjacent locations, respectively. (Diagonal locations do not count as adjacent.)

In the above example, there are four low points, all highlighted: two are in the first row (a 1 and a 0), one is in the third row (a 5), and one is in the bottom row (also a 5). All other locations on the heightmap have some lower adjacent location, and so are not low points.

The risk level of a low point is 1 plus its height. In the above example, the risk levels of the low points are 2, 1, 6, and 6. The sum of the risk levels of all low points in the heightmap is therefore 15.

Find all of the low points on your heightmap. What is the sum of the risk levels of all low points on your heightmap?
 */

const testInput = [
  '2199943210',
  '3987894921',
  '9856789892',
  '8767896789',
  '9899965678',
];

const testMap = testInput.map((row) => row.split('').map((el) => parseInt(el)));

// First find locations that are lower than any of the adjacent points.
// Adjacent points are points up/down/left/right of the current point.

const fs = require('fs');

const input = fs.readFileSync('./input/day9.txt', 'utf-8').split('\n');

// Create numeric point map of rows/cols
const pointMap = input.map((row) => row.split('').map((el) => parseInt(el)));

console.log(
  'Part 1 Answer: Total Risk Level of Lowest Map Points: ',
  lowestPoints(pointMap)[0]
); // 545

/**
 * Calculates and returns the Risk Level of the terrain as well as an object containing the lowest points in the terrain
 *
 * @param {Numbers[][]} pointMap Height Map of terrain, each entry is an array of numbers representing the terrain height at that row, column position.
 * @returns {[Number, {[key: string]: Number}]} The first entry is the risk level of the lowest points in the input map,
 * the second entry is an object with keys being the locations of the lowest points and the values being the corresponding height of the lowest points
 */
function lowestPoints(pointMap) {
  const lowest = {};
  let riskLevel = 0;

  const rowMax = pointMap.length;
  const colMax = pointMap[0].length;
  // Iterate through pointMap and locate points lower than their surroundings:
  for (let i = 0; i < rowMax; i += 1) {
    for (let j = 0; j < colMax; j += 1) {
      const pointVal = pointMap[i][j];
      // Determine if current point is lower than its surroundings:
      if (i - 1 >= 0 && pointMap[i - 1][j] <= pointVal) {
        continue;
      } else if (i + 1 < rowMax && pointMap[i + 1][j] <= pointVal) {
        continue;
      } else if (j - 1 >= 0 && pointMap[i][j - 1] <= pointVal) {
        continue;
      } else if (j + 1 < colMax && pointMap[i][j + 1] <= pointVal) {
        continue;
      }
      // If we reach here this point is lower than all its surroundings:
      lowest[[i, j]] = pointVal;
      riskLevel += pointVal + 1;
    }
  }

  return [riskLevel, lowest];
}

/**
 * --- Part Two ---
Next, you need to find the largest basins so you know what areas are most important to avoid.

A basin is all locations that eventually flow downward to a single low point. Therefore, every low point has a basin, although some basins are very small. Locations of height 9 do not count as being in any basin, and all other locations will always be part of exactly one basin.

The size of a basin is the number of locations within the basin, including the low point. The example above has four basins.

The top-left basin, size 3:

2199943210
3987894921
9856789892
8767896789
9899965678
The top-right basin, size 9:

2199943210
3987894921
9856789892
8767896789
9899965678
The middle basin, size 14:

2199943210
3987894921
9856789892
8767896789
9899965678
The bottom-right basin, size 9:

2199943210
3987894921
9856789892
8767896789
9899965678
Find the three largest basins and multiply their sizes together. In the above example, this is 9 * 14 * 9 = 1134.

What do you get if you multiply together the sizes of the three largest basins?
 */

// Use BFS/DFS to find all points associated with each basin

console.log(
  'Part 2 Answer: Multiplied sizes of three largest basins on map: ',
  mapBasins(pointMap)
); // 950600

/**
 * Calculates and returns sizes of the three largest basins in the map multiplied together
 *
 * @param {Numbers[][]} pointMap Height Map of terrain, each entry is an array of numbers representing the terrain height at that row, column position.
 * @returns {Number} Size of the three largest basins multipled together
 */
function mapBasins(pointMap) {
  // Get locations of lowest points in the input
  const lowPoints = lowestPoints(pointMap)[1];
  const biggest = [0, 0, 0];

  // For each low point, map its basin and add its basin size to lowPoints object:
  const rowMax = pointMap.length;
  const colMax = pointMap[0].length;

  Object.keys(lowPoints).forEach((coords) => {
    const [startRow, startCol] = coords.split(',').map((el) => parseInt(el));
    const stack = [[startRow, startCol]];
    let size = 1;
    pointMap[startRow][startCol] = 9;

    // Find all points associated with this low point:
    while (stack.length) {
      const [row, col] = stack.pop();
      // console.log(pointMap, row, col, stack);

      // Add any valid surrounding points to stack:
      for (let inc = -1; inc < 2; inc += 2) {
        // Check up/down:
        if (
          row + inc >= 0 &&
          row + inc < rowMax &&
          pointMap[row + inc][col] !== 9
        ) {
          stack.push([row + inc, col]);
          size += 1;
          pointMap[row + inc][col] = 9;
        }
        // Check left/right:
        if (
          col + inc >= 0 &&
          col + inc < colMax &&
          pointMap[row][col + inc] !== 9
        ) {
          stack.push([row, col + inc]);
          size += 1;
          pointMap[row][col + inc] = 9;
        }
      }
    }

    // Track the size of each basin and the size of the three largest basins
    lowPoints[coords] = size;
    if (size > biggest[2]) {
      biggest[0] = biggest[1];
      biggest[1] = biggest[2];
      biggest[2] = size;
    } else if (size > biggest[1]) {
      biggest[0] = biggest[1];
      biggest[1] = size;
    } else if (size > biggest[0]) {
      biggest[0] = size;
    }
  });

  // Return product of 3 largest basins
  return biggest.reduce((accum, el) => (accum *= el), 1);
}
