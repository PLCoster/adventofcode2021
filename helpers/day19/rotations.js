const zRot = [
  // Clockwise rotation around z by 90 degrees
  [0, 1, 0],
  [-1, 0, 0],
  [0, 0, 1],
];

const xRot = [
  // Clockwise rotation around x by 90 degrees
  [1, 0, 0],
  [0, 0, 1],
  [0, -1, 0],
];

const yRot = [
  // Clockwise rotation around y by 90 degrees
  [0, 0, -1],
  [0, 1, 0],
  [1, 0, 0],
];

const xFlip = [
  [-1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const yFlip = [
  [1, 0, 0],
  [0, -1, 0],
  [0, 0, 1],
];

const zFlip = [
  [1, 0, 0],
  [0, -1, 0],
  [0, 0, 1],
];

const rotations = [xRot, yRot, zRot];
const reflections = [xFlip, yFlip, zFlip];

module.exports = [rotations, reflections];

// const vec = [
//   // 90 deg rotations around z
//   [1, 0, 1], // x, z
//   [0, 1, 1], // y, z
//   [-1, 0, 1], // -x, z
//   [0, -1, 1], // -y, z
// ];

// const vec2 = [
//   // 90 deg rotations around x
//   [1, 1, 0], // x, y
//   [1, 0, 1], // x, z
//   [1, -1, 0], // x, -y
//   [1, 0, -1], // x, -z
// ];

// const vec3 = [
//   // 90 deg rotations around y
//   [1, 1, 0], // x, y
//   [0, 1, -1], // y, -z
//   [-1, 1, 0], // -x, y
//   [0, 1, 1], // y, z
// ];

// const testVec = [1, 2, 3];

// TEST of finding all 24 rotation orientations of a scanner / cube
// const mjs = require('mathjs');

// const results = {};
// const rot = rotations[0];
// const turn = rotations[2];

// let vec = testVec;

// for (let i = 0; i < 6; i += 1) {
//   for (let j = 0; j < 4; j += 1) {
//     if (j === 0) {
//       console.log('Rotating');
//       vec = mjs.multiply(vec, rot);
//     } else {
//       console.log('Turning');
//       vec = mjs.multiply(vec, turn);
//     }
//     console.log('Vec is: ', vec);
//     results[vec] = vec;
//   }
//   if (i === 2) {
//     vec = mjs.multiply(mjs.multiply(mjs.multiply(vec, rot), turn), rot);
//     console.log('RTR: ', vec);
//   }
// }

// console.log(results, Object.keys(results).length);
