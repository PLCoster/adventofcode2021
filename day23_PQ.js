/**
 * --- Day 23: Amphipod ---
A group of amphipods notice your fancy submarine and flag you down. "With such an impressive shell," one amphipod says, "surely you can help us with a question that has stumped our best scientists."

They go on to explain that a group of timid, stubborn amphipods live in a nearby burrow. Four types of amphipods live there: Amber (A), Bronze (B), Copper (C), and Desert (D). They live in a burrow that consists of a hallway and four side rooms. The side rooms are initially full of amphipods, and the hallway is initially empty.

They give you a diagram of the situation (your puzzle input), including locations of each amphipod (A, B, C, or D, each of which is occupying an otherwise open space), walls (#), and open space (.).

For example:

#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########
The amphipods would like a method to organize every amphipod into side rooms so that each side room contains one type of amphipod and the types are sorted A-D going left to right, like this:

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########
Amphipods can move up, down, left, or right so long as they are moving into an unoccupied open space. Each type of amphipod requires a different amount of energy to move one step: Amber amphipods require 1 energy per step, Bronze amphipods require 10 energy, Copper amphipods require 100, and Desert ones require 1000. The amphipods would like you to find a way to organize the amphipods that requires the least total energy.

However, because they are timid and stubborn, the amphipods have some extra rules:

Amphipods will never stop on the space immediately outside any room. They can move into that space so long as they immediately continue moving. (Specifically, this refers to the four open spaces in the hallway that are directly above an amphipod starting position.)
Amphipods will never move from the hallway into a room unless that room is their destination room and that room contains no amphipods which do not also have that room as their own destination. If an amphipod's starting room is not its destination room, it can stay in that room until it leaves the room. (For example, an Amber amphipod will not move from the hallway into the right three rooms, and will only move into the leftmost room if that room is empty or if it only contains other Amber amphipods.)
Once an amphipod stops moving in the hallway, it will stay in that spot until it can move into a room. (That is, once any amphipod starts moving, any other amphipods currently in the hallway are locked in place and will not move again until they can move fully into a room.)
In the above example, the amphipods can be organized using a minimum of 12521 energy. One way to do this is shown below.

Starting configuration:

#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########
One Bronze amphipod moves into the hallway, taking 4 steps and using 40 energy:

#############
#...B.......#
###B#C#.#D###
  #A#D#C#A#
  #########
The only Copper amphipod not in its side room moves there, taking 4 steps and using 400 energy:

#############
#...B.......#
###B#.#C#D###
  #A#D#C#A#
  #########
A Desert amphipod moves out of the way, taking 3 steps and using 3000 energy, and then the Bronze amphipod takes its place, taking 3 steps and using 30 energy:

#############
#.....D.....#
###B#.#C#D###
  #A#B#C#A#
  #########
The leftmost Bronze amphipod moves to its room using 40 energy:

#############
#.....D.....#
###.#B#C#D###
  #A#B#C#A#
  #########
Both amphipods in the rightmost room move into the hallway, using 2003 energy in total:

#############
#.....D.D.A.#
###.#B#C#.###
  #A#B#C#.#
  #########
Both Desert amphipods move into the rightmost room using 7000 energy:

#############
#.........A.#
###.#B#C#D###
  #A#B#C#D#
  #########
Finally, the last Amber amphipod moves into its room, using 8 energy:

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########
What is the least energy required to organize the amphipods?
 */

// Try writing Dijkstras Algorithm to solve this problem.
// - Use a priority queue / min heap to store the next node to explore?
// - Or otherwise always extract the lowest cost state from the queue
// Nodes in graph are states of the animals on the board
// The 'distance' or 'cost' to reach each node is the energy taken to get to that state.

// Rules:
// Animals can only make at most two moves:
// - Move into hallway
// - Move back into room (or move directly from one room into another)
// Animals will only move into a room that is their final room, and contains no incorrect animals in it
// Animals will never move into the hallway and stop directly in front of a room opening

const PriorityQueue = require('./helpers/PriorityQueue');

// Constants to aid the function:
const movePrices = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

const correctRooms = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

const animalRoomEntryFromHall = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const roomEntryFromHall = {
  0: 2,
  1: 4,
  2: 6,
  3: 8,
};

const part1TestInput = 'ABDCCBAD';

const part1TestInput2 = 'AABBCCDD';

// console.log('Part 1 Test Result: ', organizeAmphipods(part1TestInput)); // 12521

const part1Input = 'DADCBBCA';

// With improved state representation (string) and priority queue, this takes < 1 second now
console.log(
  'Part 1: Minimum Cost to Organize 8 Amphipods: ',
  organizeAmphipods(part1Input)
); // 18195

/**
 * Organizes amphipods from their starting positions into correct positions.
 * Uses Djikstra's Algorithm to find the minimum cost to correctly position amphipods.
 * @param {String} inputRooms Initial state of rooms to be organized
 * @returns {Number} Minimum cost to move amphipods from starting positions to organized positions
 */
function organizeAmphipods(inputRooms) {
  // Set initial world state and 'finished' world state
  const state = '.'.repeat(11) + inputRooms;
  const roomSize = inputRooms.length / 4;
  const endingState =
    '.'.repeat(11) +
    'A'.repeat(roomSize) +
    'B'.repeat(roomSize) +
    'C'.repeat(roomSize) +
    'D'.repeat(roomSize);

  // Set initial PQ
  const queue = new PriorityQueue();
  queue.add(state, 0);
  const explored = new Set();

  // Run until solved or we run out of states to search
  while (!queue.isEmpty()) {
    // Get lowest cost state still in the queueObj, add it to explored
    const [currState, currCost] = queue.remove();
    explored.add(currState);
    // If the current state is the finished state, return its cost:
    if (currState === endingState) {
      return currCost;
    }

    // If there are animals in the hallway, see if they can move into their room
    // We should always take these moves if possible, and not move more animals into the hall if they are available
    let movedIntoRoom = false;
    for (let pos = 0; pos < 11; pos += 1) {
      if (currState[pos] === '.') {
        continue;
      }

      // Check if the animal can enter their final room (only contains correct animal type):
      const animal = currState[pos];
      const goalRoom = correctRooms[animal];
      let placesInRoom = roomSize;
      let roomPosition;
      let canEnter = true;
      for (
        let j = 11 + goalRoom * roomSize;
        j < 11 + roomSize + goalRoom * roomSize;
        j += 1
      ) {
        if (currState[j] === animal) {
          placesInRoom -= 1;
        } else if (currState[j] === '.') {
          roomPosition = j;
          break;
        } else {
          // Wrong animal in room, cannot enter currently
          canEnter = false;
          break;
        }
      }
      // If their goal room is not ready to be entered, the animal in the hall cannot move now
      if (!canEnter) {
        continue;
      }

      // Otherwise we need to check if the animal can reach their room entrance:
      const entryIndex = animalRoomEntryFromHall[animal];
      let inc = 1;
      let currPos = pos;
      let stepsAlongHall = 0;
      let reachable = true;
      if (entryIndex < currPos) inc = -1;

      while (currPos !== entryIndex) {
        currPos = currPos + inc;
        stepsAlongHall += 1;

        if (currState[currPos] !== '.') {
          reachable = false;
          break;
        }
      }

      // If the hallway is blocked then we cannot reach the room, skip moving this animal
      if (!reachable) {
        continue;
      }

      // We now have an animal in the hall whose room can be entered.
      // Need to calculate the cost of this new state and add it to
      // our queue:
      movedIntoRoom = true;
      const newCost =
        currCost +
        stepsAlongHall * movePrices[animal] +
        placesInRoom * movePrices[animal];
      let newState = currState.split('');
      newState[pos] = '.';
      newState[roomPosition] = animal;
      newState = newState.join('');

      // Only add this state to queue if we have not previously explored it:
      if (!explored.has(newState)) {
        // If the state is already in our queue, update it to lowest cost:
        const oldCost = queue.contains(newState);
        if (oldCost === -1) {
          queue.add(newState, newCost);
        } else if (newCost < oldCost) {
          queue.update(newState, newCost);
        }
      }
    }

    // If we were able to move animals into rooms, ignore moving animals out of rooms from this state:
    if (movedIntoRoom) {
      continue;
    }

    // Otherwise for animals in their rooms, see if they can move into the hall:
    for (let roomNo = 0; roomNo < 4; roomNo += 1) {
      // Find the first animal in the room if any:
      let animal = null;
      let stepsToHall = 1;
      let roomPosition;
      for (
        let i = 10 + roomSize + roomNo * roomSize;
        i > 10 + roomNo * roomSize;
        i -= 1
      ) {
        if (currState[i] !== '.') {
          animal = currState[i];
          roomPosition = i;
          break;
        }
        stepsToHall += 1;
      }
      // If room contains no animals, nothing to do
      if (!animal) continue;
      // Determine all valid hallway positions the animal can move to:
      const validPositions = [];
      let currPos = roomEntryFromHall[roomNo];
      // Check positions to the left:
      while (currPos >= 0) {
        // Cannot move to position directly in front of room entrance
        if ([2, 4, 6, 8].includes(currPos)) {
          currPos -= 1;
          continue;
        }
        // If a position is occupied we cannot move any further left
        if (currState[currPos] !== '.') {
          break;
        }
        validPositions.push(currPos);
        currPos -= 1;
      }

      // Check positions to the right:
      currPos = roomEntryFromHall[roomNo];
      while (currPos <= 10) {
        // Cannot move to position directly in front of room entrance
        if ([2, 4, 6, 8].includes(currPos)) {
          currPos += 1;
          continue;
        }
        // If a position is occupied we cannot move any further left
        if (currState[currPos] !== '.') {
          break;
        }
        validPositions.push(currPos);
        currPos += 1;
      }

      // We now have an array of valid positions we can move the current animal to.
      // We need to calculate the cost of these new positions and add them to our queue.
      for (let i = 0; i < validPositions.length; i += 1) {
        const newPos = validPositions[i];
        const newCost =
          currCost +
          stepsToHall * movePrices[animal] +
          Math.abs(roomEntryFromHall[roomNo] - newPos) * movePrices[animal];

        let newState = currState.split('');
        newState[newPos] = animal;
        newState[roomPosition] = '.';
        newState = newState.join('');

        // Only add this state to queue if we have not previously explored it:
        if (!explored.has(newState)) {
          // If the state is already in our queue, update it to lowest cost:
          const oldCost = queue.contains(newState);
          if (oldCost === -1) {
            queue.add(newState, newCost);
          } else if (newCost < oldCost) {
            queue.update(newState, newCost);
          }
        }
      }
    }
  }
  // Queue is empty, and we have not solved the puzzle, not solvable
  return -1;
}

/**
 * --- Part Two ---
As you prepare to give the amphipods your solution, you notice that the diagram they handed you was actually folded up. As you unfold it, you discover an extra part of the diagram.

Between the first and second lines of text that contain amphipod starting positions, insert the following lines:

  #D#C#B#A#
  #D#B#A#C#
So, the above example now becomes:

#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########
The amphipods still want to be organized into rooms similar to before:

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########
In this updated example, the least energy required to organize these amphipods is 44169:

#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#..........D#
###B#C#B#.###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#A.........D#
###B#C#B#.###
  #D#C#B#.#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#A........BD#
###B#C#.#.###
  #D#C#B#.#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#A......B.BD#
###B#C#.#.###
  #D#C#.#.#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#AA.....B.BD#
###B#C#.#.###
  #D#C#.#.#
  #D#B#.#C#
  #A#D#C#A#
  #########

#############
#AA.....B.BD#
###B#.#.#.###
  #D#C#.#.#
  #D#B#C#C#
  #A#D#C#A#
  #########

#############
#AA.....B.BD#
###B#.#.#.###
  #D#.#C#.#
  #D#B#C#C#
  #A#D#C#A#
  #########

#############
#AA...B.B.BD#
###B#.#.#.###
  #D#.#C#.#
  #D#.#C#C#
  #A#D#C#A#
  #########

#############
#AA.D.B.B.BD#
###B#.#.#.###
  #D#.#C#.#
  #D#.#C#C#
  #A#.#C#A#
  #########

#############
#AA.D...B.BD#
###B#.#.#.###
  #D#.#C#.#
  #D#.#C#C#
  #A#B#C#A#
  #########

#############
#AA.D.....BD#
###B#.#.#.###
  #D#.#C#.#
  #D#B#C#C#
  #A#B#C#A#
  #########

#############
#AA.D......D#
###B#.#.#.###
  #D#B#C#.#
  #D#B#C#C#
  #A#B#C#A#
  #########

#############
#AA.D......D#
###B#.#C#.###
  #D#B#C#.#
  #D#B#C#.#
  #A#B#C#A#
  #########

#############
#AA.D.....AD#
###B#.#C#.###
  #D#B#C#.#
  #D#B#C#.#
  #A#B#C#.#
  #########

#############
#AA.......AD#
###B#.#C#.###
  #D#B#C#.#
  #D#B#C#.#
  #A#B#C#D#
  #########

#############
#AA.......AD#
###.#B#C#.###
  #D#B#C#.#
  #D#B#C#.#
  #A#B#C#D#
  #########

#############
#AA.......AD#
###.#B#C#.###
  #.#B#C#.#
  #D#B#C#D#
  #A#B#C#D#
  #########

#############
#AA.D.....AD#
###.#B#C#.###
  #.#B#C#.#
  #.#B#C#D#
  #A#B#C#D#
  #########

#############
#A..D.....AD#
###.#B#C#.###
  #.#B#C#.#
  #A#B#C#D#
  #A#B#C#D#
  #########

#############
#...D.....AD#
###.#B#C#.###
  #A#B#C#.#
  #A#B#C#D#
  #A#B#C#D#
  #########

#############
#.........AD#
###.#B#C#.###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########

#############
#..........D#
###A#B#C#.###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########

Using the initial configuration from the full diagram, what is the least energy required to organize the amphipods?
 */

const part2TestInput = 'ADDBDBCCCABBACAD';

const part2TestInput2 = 'AAAABBBBCCCCDDDD';

// console.log('Part 2 Test Result: ', organizeAmphipods(part2TestInput)); // 44169 Working

const part2Input = 'DDDADBCCBABBCCAA';

// As above, by changing the state representation to a string, which avoids stringify operations,
// and the use of a priority queue, the runtime of the algorithm is now < 1 second for this input
console.log(
  'Part 2: Minimum Cost to Organize 16 Amphipods: ',
  organizeAmphipods(part2Input)
); // 50265
