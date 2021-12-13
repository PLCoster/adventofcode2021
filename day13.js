/**
 * --- Day 13: Transparent Origami ---
You reach another volcanically active part of the cave. It would be nice if you could do some kind of thermal imaging so you could tell ahead of time which caves are too hot to safely enter.

Fortunately, the submarine seems to be equipped with a thermal camera! When you activate it, you are greeted with:

Congratulations on your purchase! To activate this infrared thermal imaging
camera system, please enter the code found on page 1 of the manual.
Apparently, the Elves have never used this feature. To your surprise, you manage to find the manual; as you go to open it, page 1 falls out. It's a large sheet of transparent paper! The transparent paper is marked with random dots and includes instructions on how to fold it up (your puzzle input). For example:

6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
The first section is a list of dots on the transparent paper. 0,0 represents the top-left coordinate. The first value, x, increases to the right. The second value, y, increases downward. So, the coordinate 3,0 is to the right of 0,0, and the coordinate 0,7 is below 0,0. The coordinates in this example form the following pattern, where # is a dot on the paper and . is an empty, unmarked position:

...#..#..#.
....#......
...........
#..........
...#....#.#
...........
...........
...........
...........
...........
.#....#.##.
....#......
......#...#
#..........
#.#........
Then, there is a list of fold instructions. Each instruction indicates a line on the transparent paper and wants you to fold the paper up (for horizontal y=... lines) or left (for vertical x=... lines). In this example, the first fold instruction is fold along y=7, which designates the line formed by all of the positions where y is 7 (marked here with -):

...#..#..#.
....#......
...........
#..........
...#....#.#
...........
...........
-----------
...........
...........
.#....#.##.
....#......
......#...#
#..........
#.#........
Because this is a horizontal line, fold the bottom half up. Some of the dots might end up overlapping after the fold is complete, but dots will never appear exactly on a fold line. The result of doing this fold looks like this:

#.##..#..#.
#...#......
......#...#
#...#......
.#.#..#.###
...........
...........
Now, only 17 dots are visible.

Notice, for example, the two dots in the bottom left corner before the transparent paper is folded; after the fold is complete, those dots appear in the top left corner (at 0,0 and 0,1). Because the paper is transparent, the dot just below them in the result (at 0,3) remains visible, as it can be seen through the transparent paper.

Also notice that some dots can end up overlapping; in this case, the dots merge together and become a single dot.

The second fold instruction is fold along x=5, which indicates this line:

#.##.|#..#.
#...#|.....
.....|#...#
#...#|.....
.#.#.|#.###
.....|.....
.....|.....
Because this is a vertical line, fold left:

#####
#...#
#...#
#...#
#####
.....
.....
The instructions made a square!

The transparent paper is pretty big, so for now, focus on just completing the first fold. After the first fold in the example above, 17 dots are visible - dots that end up overlapping after the fold is completed count as a single dot.

How many dots are visible after completing just the first fold instruction on your transparent paper?
 */

// The coords are a list of dots on the transparent paper
// First value is x, second value is y coord
// x increases to the right, y increases to the bottom of the paper

// Fold the paper up if the fold is along y
// Fold the paper left if the fold is along x

const fs = require('fs');

// // Process test input into coordinates and folds
// let [testCoords, testFolds] = processInput(
//   fs.readFileSync('./input/day13_test.txt', 'utf-8')
// );
// console.log(foldPaper(testCoords, testFolds)); // 17

// Process input into set of coordinates and folds
let [coords, folds] = processInput(
  fs.readFileSync('./input/day13.txt', 'utf-8')
);

console.log(
  'Part 1 Answer: Number of visible dots after one fold: ',
  foldPaper(coords, folds)[1]
); // 602

/**
 * --- Part Two ---
Finish folding the transparent paper according to the instructions. The manual says the code is always eight capital letters.

What code do you use to activate the infrared thermal imaging camera system?
 */

decipherCode(fs.readFileSync('./input/day13.txt', 'utf-8')); // CAFJHZCJK

console.log('Part 2 Answer: Code is CAFJHZCJK');

/**
 * Processes raw puzzle input and returns an array containing an array of initial dot coords and the fold instructions
 * @param {String} input Raw puzzle input
 * @returns {[{[key: string]: Number[]}, [String, Number][]]} Array containing the initial dot coords in an object and
 * array of folding instructions.
 */
function processInput(input) {
  let [coords, folds] = input.split('\n\n');

  coords = coords
    .split('\n')
    .map((el) => el.split(',').map((str) => parseInt(str)));

  folds = folds.split('\n').map((el) =>
    el
      .match(/(x|y)=[0-9]+/)[0]
      .split('=')
      .map((str, index) => (index === 0 ? str : parseInt(str)))
  );

  return [coords, folds];
}

/**
 * Folds transparent paper following folding instructions.
 * Returns the final position of dots on the paper and the total number of dots after one or all folds completed.
 * @param {{[key: string]: Number[]}} coords Object containing the coordinates of all dots on the paper.
 * Key is string representation of coords while value is an array containing the row and column values as numbers.
 * @param {[String, Number][]} folds Array containing folding instructions, each instruction is an array containing
 * a direction ('x' or 'y') and a line number, indicating the row or column along which the fold should be made.
 * @param {Boolean} single If true, paper will only be folded a single time, otherwise all folding instructions will
 * be followed. Default setting is true.
 * @returns {[coords, Number]} Returns locations of dots after folding (coords as coords object) and Number of dots visible
 * after completing desired number of folds.
 */
function foldPaper(coords, folds, single = true) {
  // First create an object to hold all paper coords
  let dotsObj = coords.reduce((accum, coord) => {
    accum[coord] = coord;
    return accum;
  }, {});

  const steps = single ? 1 : folds.length;

  // Apply folds to paper:
  for (let i = 0; i < steps; i += 1) {
    const [direction, line] = folds[i];
    const foldResult = {};

    // If direction is y we are folding up, otherwise we are folding left:
    let coordInd;
    if (direction === 'y') {
      coordInd = 1;
    } else {
      coordInd = 0;
    }

    // For each dot we move them relative to the fold.
    // If the dot is to the left or above the fold it doesnt move
    // If the dot is to the right of the fold or below the fold, its new position is related toits distance from the fold line
    Object.values(dotsObj).forEach((coords) => {
      if (coords[coordInd] > line) {
        coords[coordInd] = line - (coords[coordInd] - line);
      }
      foldResult[coords] = coords;
    });
    dotsObj = foldResult;
  }
  return [dotsObj, Object.keys(dotsObj).length];
}

/**
 * Takes puzzle input, folds paper following instructions and writes the final paper state (code) to file
 * @param {String} input Raw puzzle input
 */
function decipherCode(input) {
  const [coords, folds] = processInput(input);
  const [finalDots, finalDotCount] = foldPaper(coords, folds, false);

  // Create an output file to read out code from:
  const [maxRow, maxCol] = Object.values(finalDots).reduce(
    (accum, [row, col]) => {
      if (row > accum[0]) {
        accum[0] = row;
      }
      if (col > accum[1]) {
        accum[1] = col;
      }
      return accum;
    },
    [0, 0]
  );

  const output = [];
  for (let i = 0; i < maxCol + 1; i += 1) {
    output.push(new Array(maxRow + 1).fill('.'));
  }

  // Update output with dot locations:
  Object.values(finalDots).forEach(([row, col]) => (output[col][row] = '#'));

  fs.writeFileSync(
    './output/day13_output.txt',
    output.map((el) => el.join('')).join('\n')
  );
}
