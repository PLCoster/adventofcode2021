/**
 * --- Day 21: Dirac Dice ---
There's not much to do as you slowly descend to the bottom of the ocean. The submarine computer challenges you to a nice game of Dirac Dice.

This game consists of a single die, two pawns, and a game board with a circular track containing ten spaces marked 1 through 10 clockwise. Each player's starting space is chosen randomly (your puzzle input). Player 1 goes first.

Players take turns moving. On each player's turn, the player rolls the die three times and adds up the results. Then, the player moves their pawn that many times forward around the track (that is, moving clockwise on spaces in order of increasing value, wrapping back around to 1 after 10). So, if a player is on space 7 and they roll 2, 2, and 1, they would move forward 5 times, to spaces 8, 9, 10, 1, and finally stopping on 2.

After each player moves, they increase their score by the value of the space their pawn stopped on. Players' scores start at 0. So, if the first player starts on space 7 and rolls a total of 5, they would stop on space 2 and add 2 to their score (for a total score of 2). The game immediately ends as a win for any player whose score reaches at least 1000.

Since the first game is a practice game, the submarine opens a compartment labeled deterministic dice and a 100-sided die falls out. This die always rolls 1 first, then 2, then 3, and so on up to 100, after which it starts over at 1 again. Play using this die.

For example, given these starting positions:

Player 1 starting position: 4
Player 2 starting position: 8
This is how the game would go:

Player 1 rolls 1+2+3 and moves to space 10 for a total score of 10.
Player 2 rolls 4+5+6 and moves to space 3 for a total score of 3.
Player 1 rolls 7+8+9 and moves to space 4 for a total score of 14.
Player 2 rolls 10+11+12 and moves to space 6 for a total score of 9.
Player 1 rolls 13+14+15 and moves to space 6 for a total score of 20.
Player 2 rolls 16+17+18 and moves to space 7 for a total score of 16.
Player 1 rolls 19+20+21 and moves to space 6 for a total score of 26.
Player 2 rolls 22+23+24 and moves to space 6 for a total score of 22.
...after many turns...

Player 2 rolls 82+83+84 and moves to space 6 for a total score of 742.
Player 1 rolls 85+86+87 and moves to space 4 for a total score of 990.
Player 2 rolls 88+89+90 and moves to space 3 for a total score of 745.
Player 1 rolls 91+92+93 and moves to space 10 for a final score, 1000.
Since player 1 has at least 1000 points, player 1 wins and the game ends. At this point, the losing player had 745 points and the die had been rolled a total of 993 times; 745 * 993 = 739785.

Play a practice game using the deterministic 100-sided die. The moment either player wins, what do you get if you multiply the score of the losing player by the number of times the die was rolled during the game?
 */

// Game board is a circle of 10 spaces marked 1 to 10
// Two pawns are placed on the board, starting positions are random

// Players take turns moving
// On each turn the player rolls the dice 3 times and adds the results then moves their pawn that many spaces forward

// After each player moves they increase their score by the value of the spaces they stopped on during their move, scores start at 0.

// The game ends as a win for any player whose score reaches 1000 or more.

// For the practice game they use a deterministic dice
// The dice rolls 1, 2, 3, to 100 and starts at 1 again

// TEST INPUT
// const player1StartPos = 4;
// const player2StartPos = 8; // Part 1 answer 739785

/**
 * Class to simlulate the dirac Dice game using the deterministic dice
 */
class diracDiceGame {
  constructor(p1Start, p2Start, deterministic = true) {
    this.positions = [p1Start, p2Start];
    this.scores = [0, 0];
    this.die = deterministic ? new deterministicDie() : null;
    this.numRolls = 0;
    this.playerInd = 0;
  }

  // Plays the game until the first winner, then stops
  playGame() {
    // Play until either player wins
    while (this.scores[0] < 1000 && this.scores[1] < 1000) {
      // Each player makes three rolls per turn:
      for (let i = 0; i < 3; i += 1) {
        // Moves >= 10 will just loop around the board
        const move = this.die.roll() % 10;
        this.numRolls += 1;
        this.positions[this.playerInd] += move;

        // Move player position
        if (this.positions[this.playerInd] > 10) {
          this.positions[this.playerInd] = this.positions[this.playerInd] % 10;
        }

        // If score breaks 1000 this player has won:
        if (this.scores[this.playerInd] > 1000) {
          break;
        }
      }

      // Update player score based on final position
      this.scores[this.playerInd] += this.positions[this.playerInd];

      // console.log(
      //   'Player: ',
      //   this.playerInd + 1,
      //   'Position: ',
      //   this.positions[this.playerInd],
      //   'Score: ',
      //   this.scores[this.playerInd],
      //   '\n'
      // );

      // Next players turn:
      this.playerInd = (this.playerInd + 1) % 2;
    }
  }

  // Helper method to get part1 answer:
  part1Answer() {
    // Return score of losing player by the number of times dice was rolled:
    return Math.min(...this.scores) * this.numRolls;
  }
}

/**
 * Class that simulates the deterministic dice
 */
class deterministicDie {
  constructor() {
    this.lastRoll = 100;
  }

  // Return the next roll from the dice
  roll() {
    let nextRoll = this.lastRoll + 1;
    if (nextRoll > 100) nextRoll -= 100;
    this.lastRoll = nextRoll;

    return nextRoll;
  }
}

const player1StartPos = 10;
const player2StartPos = 7;

const game = new diracDiceGame(player1StartPos, player2StartPos);
game.playGame();
console.log(
  'Part 1 Answer: Loser Score times number of dice rolls after first winner with deterministic dice: ',
  game.part1Answer()
); // 906093

/**
 *--- Part Two ---
Now that you're warmed up, it's time to play the real game.

A second compartment opens, this time labeled Dirac dice. Out of it falls a single three-sided die.

As you experiment with the die, you feel a little strange. An informational brochure in the compartment explains that this is a quantum die: when you roll it, the universe splits into multiple copies, one copy for each possible outcome of the die. In this case, rolling the die always splits the universe into three copies: one where the outcome of the roll was 1, one where it was 2, and one where it was 3.

The game is played the same as before, although to prevent things from getting too far out of hand, the game now ends when either player's score reaches at least 21.

Using the same starting positions as in the example above, player 1 wins in 444356092776315 universes, while player 2 merely wins in 341960390180808 universes.

Using your given starting positions, determine every possible outcome. Find the player that wins in more universes; in how many universes does that player win?
 */

// The dice can roll a 1, 2 or 3, and for each roll a new universe is created.
// Each turn consists of three rolls. So after a single turn there are already 27 different possible universes created (3 x 3 x 3).

// Since players score at least 1 point every turn, and generate 27 universes on each turn, absolute worst case would be 21 turns each to get a winner.
// if the score to win is 21. Hence the total number of possible universes must be << (27^42), a very large number of universes.
// Brute force determination of very single winner in every universe would take a very long time!

// We can instead use memoisation to speed up the calculation.
// If we have already calculated the number of wins for each player when they have X score and Y score
// and are in X position and Y position, if we encounter the same state again, we can just reuse the previously
// calculated answer.

/**
 * Counts and returns the total number of wins for each player across every possible Universe
 * @param {Number} p1Start Player 1 starting position
 * @param {Number} p2Start Player 2 starting position
 * @param {Boolean} opt Whether or not to optimise the number of Universe splits when rolling dice (default false)
 * @returns {[Number, Number]} Array containing the total number of wins for each player across all Universes
 */
function countWins(p1Start, p2Start, opt = false) {
  const memo = {};

  function countWinsHelper(player, pos0, score0, pos1, score1) {
    // If we have already determined number of wins
    // From this point in a separate branch, return those value:
    if ([player, pos0, score0, pos1, score1] in memo) {
      return memo[[player, pos0, score0, pos1, score1]];
    }
    // Otherwise if the game has reached its conclusion, return winner:
    if (score0 >= 21) {
      return [1, 0];
    } else if (score1 >= 21) {
      return [0, 1];
    }

    // Else we need to recurse:
    const wins = [0, 0];

    // There are 27 possible dice rolls on each turn (3 x 3 x 3)
    if (!opt) {
      for (let i = 1; i < 4; i += 1) {
        for (let j = 1; j < 4; j += 1) {
          for (let k = 1; k < 4; k += 1) {
            const moveTotal = i + j + k;
            let win0, win1;
            if (player === 0) {
              [newPos, newScore] = moveAndScore(pos0, score0, moveTotal);
              [win0, win1] = countWinsHelper(1, newPos, newScore, pos1, score1);
            } else {
              [newPos, newScore] = moveAndScore(pos1, score1, moveTotal);
              [win0, win1] = countWinsHelper(0, pos0, score0, newPos, newScore);
            }

            // Add wins to current totals:
            wins[0] += win0;
            wins[1] += win1;
          }
        }
      }
      // We can optimise this step since there are only 7 possible scores with different number of occurences
    } else {
      const possibilities = [
        [3, 1], // 1 1 1
        [4, 3], // 1 1 2, 1 2 1, 2 1 1
        [5, 6], // 1 2 2, 2 1 2, 2 2 1, 1 1 3, 1 3 1, 3 1 1
        [6, 7], // etc
        [7, 6],
        [8, 3],
        [9, 1],
      ];
      for (let i = 0; i < possibilities.length; i += 1) {
        const [move, occurences] = possibilities[i];
        let win0, win1;
        if (player === 0) {
          [newPos, newScore] = moveAndScore(pos0, score0, move);
          [win0, win1] = countWinsHelper(1, newPos, newScore, pos1, score1);
        } else {
          [newPos, newScore] = moveAndScore(pos1, score1, move);
          [win0, win1] = countWinsHelper(0, pos0, score0, newPos, newScore);
        }

        // Add wins to current totals:
        wins[0] += win0 * occurences;
        wins[1] += win1 * occurences;
      }
    }

    // After calculating all possible wins, add it to the memo:
    memo[[player, pos0, score0, pos1, score1]] = wins;
    return wins;
  }
  const playerWins = countWinsHelper(0, p1Start, 0, p2Start, 0);
  return playerWins;
}

/**
 * Helper function that applies a given move to a current player position
 * @param {Number} pos Starting player position
 * @param {Number} score Starting player score
 * @param {Number} move Number of positions to move player
 * @returns {[Number, Number]} New player position and new player score after move
 */
function moveAndScore(pos, score, move) {
  let newPos = ((pos - 1 + move) % 10) + 1;

  const newScore = score + newPos;
  return [newPos, newScore];
}

// Test input - Wins for P1 vs Wins for P2:
// console.log(countWins(4, 8)); // [ 444356092776315, 341960390180808 ]

// Brute force (27 possibilities on each roll) w/memoisation:
// Takes about 1 second to run
// console.log(
//   'Part 2 Answer: The player with the most wins wins in this many Universes: ',
//   Math.max(...countWins(player1StartPos, player2StartPos))
// ); // 274291038026362

// Optimisation using only 7 branches on each roll
// Takes about 300ms to run(!)
console.log(
  'Part 2 Answer: The player with the most wins wins in this many Universes: ',
  Math.max(...countWins(player1StartPos, player2StartPos, (opt = true)))
); // 274291038026362
