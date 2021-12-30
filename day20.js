/**
 * --- Day 20: Trench Map ---
With the scanners fully deployed, you turn their attention to mapping the floor of the ocean trench.

When you get back the image from the scanners, it seems to just be random noise. Perhaps you can combine an image enhancement algorithm and the input image (your puzzle input) to clean it up a little.

For example:

..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###
.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.
.#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....
.#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..
...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....
..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
The first section is the image enhancement algorithm. It is normally given on a single line, but it has been wrapped to multiple lines in this example for legibility. The second section is the input image, a two-dimensional grid of light pixels (#) and dark pixels (.).

The image enhancement algorithm describes how to enhance an image by simultaneously converting all pixels in the input image into an output image. Each pixel of the output image is determined by looking at a 3x3 square of pixels centered on the corresponding input image pixel. So, to determine the value of the pixel at (5,10) in the output image, nine pixels from the input image need to be considered: (4,9), (4,10), (4,11), (5,9), (5,10), (5,11), (6,9), (6,10), and (6,11). These nine input pixels are combined into a single binary number that is used as an index in the image enhancement algorithm string.

For example, to determine the output pixel that corresponds to the very middle pixel of the input image, the nine pixels marked by [...] would need to be considered:

# . . # .
#[. . .].
#[# . .]#
.[. # .].
. . # # #
Starting from the top-left and reading across each row, these pixels are ..., then #.., then .#.; combining these forms ...#...#.. By turning dark pixels (.) into 0 and light pixels (#) into 1, the binary number 000100010 can be formed, which is 34 in decimal.

The image enhancement algorithm string is exactly 512 characters long, enough to match every possible 9-bit binary number. The first few characters of the string (numbered starting from zero) are as follows:

0         10        20        30  34    40        50        60        70
|         |         |         |   |     |         |         |         |
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
In the middle of this first group of characters, the character at index 34 can be found: #. So, the output pixel in the center of the output image should be #, a light pixel.

This process can then be repeated to calculate every pixel of the output image.

Through advances in imaging technology, the images being operated on here are infinite in size. Every pixel of the infinite output image needs to be calculated exactly based on the relevant pixels of the input image. The small input image you have is only a small region of the actual infinite input image; the rest of the input image consists of dark pixels (.). For the purposes of the example, to save on space, only a portion of the infinite-sized input and output images will be shown.

The starting input image, therefore, looks something like this, with more dark pixels (.) extending forever in every direction not shown here:

...............
...............
...............
...............
...............
.....#..#......
.....#.........
.....##..#.....
.......#.......
.......###.....
...............
...............
...............
...............
...............
By applying the image enhancement algorithm to every pixel simultaneously, the following output image can be obtained:

...............
...............
...............
...............
.....##.##.....
....#..#.#.....
....##.#..#....
....####..#....
.....#..##.....
......##..#....
.......#.#.....
...............
...............
...............
...............
Through further advances in imaging technology, the above output image can also be used as an input image! This allows it to be enhanced a second time:

...............
...............
...............
..........#....
....#..#.#.....
...#.#...###...
...#...##.#....
...#.....#.#...
....#.#####....
.....#.#####...
......##.##....
.......###.....
...............
...............
...............
Truly incredible - now the small details are really starting to come through. After enhancing the original input image twice, 35 pixels are lit.

Start with the original input image and apply the image enhancement algorithm twice, being careful to account for the infinite size of the images. How many pixels are lit in the resulting image?
 */

// Looking at my puzzle input, the image enhancement algorithm value at 0 is '#' and at 255 is '.'
// This means that in the 'infinite' region outside of the initial image, the values fluctuate from being all off on even steps and all on on odd steps.

// On every step the central region of the image grows in size by 1 pixel.

const fs = require('fs');

const [iea, img] = fs.readFileSync('./input/day20.txt', 'utf-8').split('\n\n');

console.log(
  'Part 1 Answer: Number of lit pixels after 2 enhancement steps: ',
  enhanceImg(iea, img)
); // 5359

/**
 * Enhances given image using image enhancement algorithm, over defined number of steps
 * @param {String} iea Image enhancement algorithm, 255 char string of '#' (1) and '.' (0)
 * @param {String} img Raw image input as a string of '#' and '.' chars
 * @param {Number} steps Number of image enhancement steps to perform, default 2
 * @returns {Number} Number of lit pixels after completing image enhancement
 */
function enhanceImg(iea, img, steps = 2) {
  // Build map of 1 / 0 pixels from image data
  let pixels = img.split('\n').map((str) =>
    str.split('').map((char) => {
      if (char === '.') return 0;
      else return 1;
    })
  );

  // Convert Image Enhancement Algorithm to 1's and 0's
  const algorithm = iea.split('').map((char) => {
    if (char === '.') return 0;
    else return 1;
  });

  // Determine if exterior pixels flip between all on/all off each step
  let flicker = false;
  if (algorithm[0] === 1 && algorithm[255] === 0) {
    flicker = true;
  }

  // Run until we have completed desired number of enhancement steps
  while (steps !== 0) {
    // Set the value of the exterior pixels on the edges of the image:
    let exterior;
    if (steps % 2 === 0 || !flicker) {
      exterior = 0;
    } else {
      exterior = 1;
    }

    // Determine values of pixels in the new image:
    const newPixels = updateImage(pixels, algorithm, exterior);
    pixels = newPixels;
    steps -= 1;
  }

  // Once we have the final image, count the number of lit pixels:
  return pixels.reduce(
    (accum, imgRow) => (accum += imgRow.reduce((sum, num) => (sum += num), 0)),
    0
  );
}

/**
 * Generates updated pixel image based on previous image.
 * @param {Number[][]} pixels 2D array of previous image pixel values
 * @param {Number[]} algorithm 255 element array of 0 and 1 values representing the image enhancement algorithm
 * @param {Number} exterior Value (1 or 0) representing the value of all exterior pixels outside the previous image area.
 * @returns {Number [][]} Updated pixel image after one enhancement step
 */
function updateImage(pixels, algorithm, exterior) {
  const newPixels = new Array();
  for (let i = 0; i < pixels.length + 2; i += 1) {
    newPixels.push(new Array(pixels[0].length + 2));
  }

  // Iterate through all pixels in the enhanced image
  for (let row = 0; row < newPixels.length; row += 1) {
    for (let col = 0; col < newPixels[0].length; col += 1) {
      // For each pixel determine is value based on the previous image and algorithm
      newPixels[row][col] = getPixelVal(
        pixels,
        row - 1,
        col - 1,
        exterior,
        algorithm
      );
    }
  }
  return newPixels;
}

/**
 * Determines the value a pixel should take in the new image, based on the
 * previous image and the image enhancement algorithm
 * @param {Number[][]} pixels 2D array of previous image pixel values
 * @param {Number} pixRow Row of the pixel we are enhancing
 * @param {Number} pixCol Column of the pixel we are enhancing
 * @param {Number} exterior Value (1 or 0) representing the value of all exterior pixels outside the previous image area.
 * @param {Number[]} algorithm 255 element array of 0 and 1 values representing the image enhancement algorithm
 * @returns {Number} Value (1 or 0) that the enhanced pixel at given position should take
 */
function getPixelVal(pixels, pixRow, pixCol, exterior, algorithm) {
  const pixelVals = [];

  for (let row = pixRow - 1; row < pixRow + 2; row += 1) {
    for (let col = pixCol - 1; col < pixCol + 2; col += 1) {
      // If we need a pixel outside of the image, use the exterior value
      if (
        row < 0 ||
        row >= pixels.length ||
        col < 0 ||
        col >= pixels[0].length
      ) {
        pixelVals.push(exterior);
      } else {
        pixelVals.push(pixels[row][col]);
      }
    }
  }
  const algoIndex = parseInt(pixelVals.join(''), 2);
  return algorithm[algoIndex];
}

/**
 * --- Part Two ---
You still can't quite make out the details in the image. Maybe you just didn't enhance it enough.

If you enhance the starting input image in the above example a total of 50 times, 3351 pixels are lit in the final output image.

Start again with the original input image and apply the image enhancement algorithm 50 times. How many pixels are lit in the resulting image?
 */

// Carry out the image enhancement with 50 steps:
console.log(
  'Part 2 Answer: Number of lit pixels after 50 steps: ',
  enhanceImg(iea, img, 50)
); // 12333
