/**
 * --- Day 12: Passage Pathing ---
With your submarine's subterranean subsystems subsisting suboptimally, the only way you're getting out of this cave anytime soon is by finding a path yourself. Not just a path - the only way to know if you've found the best path is to find all of them.

Fortunately, the sensors are still mostly working, and so you build a rough map of the remaining caves (your puzzle input). For example:

start-A
start-b
A-c
A-b
b-d
A-end
b-end
This is a list of how all of the caves are connected. You start in the cave named start, and your destination is the cave named end. An entry like b-d means that cave b is connected to cave d - that is, you can move between them.

So, the above cave system looks roughly like this:

    start
    /   \
c--A-----b--d
    \   /
     end
Your goal is to find the number of distinct paths that start at start, end at end, and don't visit small caves more than once. There are two types of caves: big caves (written in uppercase, like A) and small caves (written in lowercase, like b). It would be a waste of time to visit any small cave more than once, but big caves are large enough that it might be worth visiting them multiple times. So, all paths you find should visit small caves at most once, and can visit big caves any number of times.

Given these rules, there are 10 paths through this example cave system:

start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,end
start,A,c,A,b,A,end
start,A,c,A,b,end
start,A,c,A,end
start,A,end
start,b,A,c,A,end
start,b,A,end
start,b,end
(Each line in the above list corresponds to a single path; the caves visited by that path are listed in the order they are visited and separated by commas.)

Note that in this cave system, cave d is never visited by any path: to do so, cave b would need to be visited twice (once on the way to cave d and a second time when returning from cave d), and since cave b is small, this is not allowed.

Here is a slightly larger example:

dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
The 19 paths through it are as follows:

start,HN,dc,HN,end
start,HN,dc,HN,kj,HN,end
start,HN,dc,end
start,HN,dc,kj,HN,end
start,HN,end
start,HN,kj,HN,dc,HN,end
start,HN,kj,HN,dc,end
start,HN,kj,HN,end
start,HN,kj,dc,HN,end
start,HN,kj,dc,end
start,dc,HN,end
start,dc,HN,kj,HN,end
start,dc,end
start,dc,kj,HN,end
start,kj,HN,dc,HN,end
start,kj,HN,dc,end
start,kj,HN,end
start,kj,dc,HN,end
start,kj,dc,end
Finally, this even larger example has 226 paths through it:

fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
How many paths through this cave system are there that visit small caves at most once?
 */

// Start in the cave named start, destination is cave named end
// You are given a list of connections between caves
// Goal is to find the number of distinct paths that start at the start, end at the end, and don't visit small caves (lowercase names) more than once.

const testInput = ['start-A', 'start-b', 'A-c', 'A-b', 'b-d', 'A-end', 'b-end'];

const fs = require('fs');

// Load Puzzle input
const input = fs.readFileSync('./input/day12.txt', 'utf-8').split('\n');

// console.log(countPaths(testInput)); // 10

console.log(
  'Part 1 Answer: Number of Paths through cave system while only visiting each small cave max once: ',
  countPaths(input)
); // 3369

/**
 * Helper function that creates adjacency list representation of cave system graph
 * @param {String[]} input Puzzle input consisting of an array of strings, each string is a connection between two caves separated by a '-'
 * @returns {{[key: string]: String[]}} Adjaceny list representation of the cave system graph
 */
function createAdjacencyList(input) {
  // Iterate through input and build an adjacency list representing the cave system graph
  const adjList = {};

  for (let i = 0; i < input.length; i += 1) {
    const [cave1, cave2] = input[i].split('-');
    adjList[cave1] = adjList[cave1] || [];
    adjList[cave1].push(cave2);
    adjList[cave2] = adjList[cave2] || [];
    adjList[cave2].push(cave1);
  }

  return adjList;
}

/**
 * Counts the number of possible paths from the start to the end of the cave, with specified restrictions
 * @param {String[]} input Puzzle input consisting of an array of strings, each string is a connection between two caves separated by a '-'
 * @param {Boolean} singleDouble Whether or not a single small cave is allowed to be visited twice in a path (default false)
 * @returns {Number} Number of valid paths from start to end of cave with given restrictions
 */
function countPaths(input, singleDouble = false) {
  const adjList = createAdjacencyList(input);

  // Use DFS to find all possible paths to end from start (DFS pop much faster than BFS shift):
  let numPaths = 0;
  let finalPaths = [];
  const queue = [[['start'], false]];

  while (queue.length) {
    let [currPath, doubleVisit] = queue.pop(); // Using Shift for BFS takes about 22 seconds on full input. Using pop() for DFS takes 0.3 seconds (!).
    const currCave = currPath[currPath.length - 1];

    // If curr cave is end then add to numPaths and stop:
    if (currCave === 'end') {
      numPaths += 1;
      finalPaths.push(currPath);
      continue;
    }

    // Otherwise add all caves (non-visited small caves) as the next cave to this path:
    const nextCaves = adjList[currCave];
    for (let i = 0; i < nextCaves.length; i += 1) {
      const next = nextCaves[i];

      // If we are not allowed a single double visit to a small cave:
      if (!singleDouble || doubleVisit) {
        // If we have already visited a small cave do not add it as the next cave in a path
        if (next.toUpperCase() !== next && currPath.includes(next)) {
          continue;
        }
        queue.push([currPath.concat(next), doubleVisit]);
      } else if (next !== 'start') {
        // We can have a single double visit to a small cave:
        if (next.toUpperCase() !== next && currPath.includes(next)) {
          // Change double small cave visit flag to true
          queue.push([currPath.concat(next), true]);
        } else {
          // Not yet visited a small cave twice
          queue.push([currPath.concat(next), false]);
        }
      }
    }
  }
  return numPaths;
}

/**
 * --- Part Two ---
After reviewing the available paths, you realize you might have time to visit a single small cave twice. Specifically, big caves can be visited any number of times, a single small cave can be visited at most twice, and the remaining small caves can be visited at most once. However, the caves named start and end can only be visited exactly once each: once you leave the start cave, you may not return to it, and once you reach the end cave, the path must end immediately.

Now, the 36 possible paths through the first example above are:

start,A,b,A,b,A,c,A,end
start,A,b,A,b,A,end
start,A,b,A,b,end
start,A,b,A,c,A,b,A,end
start,A,b,A,c,A,b,end
start,A,b,A,c,A,c,A,end
start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,d,b,A,c,A,end
start,A,b,d,b,A,end
start,A,b,d,b,end
start,A,b,end
start,A,c,A,b,A,b,A,end
start,A,c,A,b,A,b,end
start,A,c,A,b,A,c,A,end
start,A,c,A,b,A,end
start,A,c,A,b,d,b,A,end
start,A,c,A,b,d,b,end
start,A,c,A,b,end
start,A,c,A,c,A,b,A,end
start,A,c,A,c,A,b,end
start,A,c,A,c,A,end
start,A,c,A,end
start,A,end
start,b,A,b,A,c,A,end
start,b,A,b,A,end
start,b,A,b,end
start,b,A,c,A,b,A,end
start,b,A,c,A,b,end
start,b,A,c,A,c,A,end
start,b,A,c,A,end
start,b,A,end
start,b,d,b,A,c,A,end
start,b,d,b,A,end
start,b,d,b,end
start,b,end
The slightly larger example above now has 103 paths through it, and the even larger example now has 3509 paths through it.

Given these new rules, how many paths through this cave system are there?
 */

// We can now visit a single small cave twice, it cannot be the start or end caves

// console.log(countPaths(testInput, true)); // 36

console.log(
  'Part 2 Answer: Number of Paths through cave system while visiting a single small cave two times max: ',
  countPaths(input, true)
); // 85883
