/**
 * --- Day 7: The Treachery of Whales ---
A giant whale has decided your submarine is its next meal, and it's much faster than you are. There's nowhere to run!

Suddenly, a swarm of crabs (each in its own tiny submarine - it's too deep for them otherwise) zooms in to rescue you! They seem to be preparing to blast a hole in the ocean floor; sensors indicate a massive underground cave system just beyond where they're aiming!

The crab submarines all need to be aligned before they'll have enough power to blast a large enough hole for your submarine to get through. However, it doesn't look like they'll be aligned before the whale catches you! Maybe you can help?

There's one major catch - crab submarines can only move horizontally.

You quickly make a list of the horizontal position of each crab (your puzzle input). Crab submarines have limited fuel, so you need to find a way to make all of their horizontal positions match while requiring them to spend as little fuel as possible.

For example, consider the following horizontal positions:

16,1,2,0,4,2,7,1,2,14
This means there's a crab with horizontal position 16, a crab with horizontal position 1, and so on.

Each change of 1 step in horizontal position of a single crab costs 1 fuel. You could choose any horizontal position to align them all on, but the one that costs the least fuel is horizontal position 2:

Move from 16 to 2: 14 fuel
Move from 1 to 2: 1 fuel
Move from 2 to 2: 0 fuel
Move from 0 to 2: 2 fuel
Move from 4 to 2: 2 fuel
Move from 2 to 2: 0 fuel
Move from 7 to 2: 5 fuel
Move from 1 to 2: 1 fuel
Move from 2 to 2: 0 fuel
Move from 14 to 2: 12 fuel
This costs a total of 37 fuel. This is the cheapest possible outcome; more expensive outcomes include aligning at position 1 (41 fuel), position 3 (39 fuel), or position 10 (71 fuel).

Determine the horizontal position that the crabs can align to using the least fuel possible. How much fuel must they spend to align to that position?
 */

// Horizontal position of each crab need to match while minimizing the amount of fuel spent.

// Here we can use the fact that the median of a set of numbers is the number that minimizes the difference between it and every other number in the array.

// A simple proof is that if we select the value to the right of the median and it is larger than the median by X, the n/2 - 1 items to the right are closer to this number by X (total (n/2 - 1) * X), but the n/2 + 1 numbers to the right of the median are (total (n/2 + 1) * X) further from the median now, so the total fuel cost increases by X when we move one svalue to the right of the median (and the same for the left).

const fs = require('fs');

const input = fs.readFileSync('./input/day7.txt', 'utf-8').split(',');

// Find the median of the list:
input.sort((a, b) => a - b);
const median = parseInt(input[Math.floor(input.length / 2)]); // 354 position

// Calculate the fuels consumption to get all crabs to the median
const fuel = input.reduce(
  (accum, el) => (accum += Math.abs(parseInt(el) - median)),
  0
);

console.log(
  'Part 1 Answer: Fuel use to move to position that minimizes fuel use: ',
  fuel
); // 349812

/**
 *  --- Part Two ---
The crabs don't seem interested in your proposed solution. Perhaps you misunderstand crab engineering?

As it turns out, crab submarine engines don't burn fuel at a constant rate. Instead, each change of 1 step in horizontal position costs 1 more unit of fuel than the last: the first step costs 1, the second step costs 2, the third step costs 3, and so on.

As each crab moves, moving further becomes more expensive. This changes the best horizontal position to align them all on; in the example above, this becomes 5:

Move from 16 to 5: 66 fuel
Move from 1 to 5: 10 fuel
Move from 2 to 5: 6 fuel
Move from 0 to 5: 15 fuel
Move from 4 to 5: 1 fuel
Move from 2 to 5: 6 fuel
Move from 7 to 5: 3 fuel
Move from 1 to 5: 10 fuel
Move from 2 to 5: 6 fuel
Move from 14 to 5: 45 fuel
This costs a total of 168 fuel. This is the new cheapest possible outcome; the old alignment position (2) now costs 206 fuel instead.

Determine the horizontal position that the crabs can align to using the least fuel possible so they can make you an escape route! How much fuel must they spend to align to that position?
 */

// Now it costs much more fuel to move a larger distance than a shorter one. In fact the distances are triangle numbers (n * (n + 1)) / 2 = (n^2 + n) / 2. Because the fuel costs are close to n^2, the arithmetic mean is close to optimal (The mean minimizes the mean squared error). (It can be shown that the optimum is within +/- 1/2 of the mean).

const mean = input.reduce((accum, el, index) => {
  const result = (accum * index + parseInt(el)) / (index + 1);
  return result;
}, 0);

// console.log('Mean value is: ', mean);

// Calculate fuel value to either side of mean:
const fuel2 = input.reduce(
  (accum, el) => {
    const diff1 = Math.abs(Math.floor(mean) - parseInt(el));
    const diff2 = Math.abs(Math.ceil(mean) - parseInt(el));
    accum[0] += (diff1 * (diff1 + 1)) / 2;
    accum[1] += (diff2 * (diff2 + 1)) / 2;
    return accum;
  },
  [0, 0]
);

console.log(
  'Part 2 Answer: Fuel cost when moving crabs to mean position +/- 1: ',
  Math.min(...fuel2)
); // 99763899

// Otherwise we could brute force by calculating the fuel cost for a subset of the values in the array (following something like gradient descent)
