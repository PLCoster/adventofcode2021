/**
 * Checks boards array for a winning board
 * @param {String[][][]} boards array of 5 x 5 game boards
 * @return {Number[]} Index of winning board(s), -1 if no winner
 */
function checkBoards(boards) {
  const winners = [];
  for (let i = 0; i < boards.length; i += 1) {
    let gameWon;

    // If board removed from play due to winning, continue:
    if (!boards[i].length) {
      continue;
    }

    // Check rows of board:
    for (let j = 0; j < 5; j += 1) {
      const row = boards[i][j];
      gameWon = row.reduce((accum, el) => {
        if (!accum) {
          return accum;
        } else if (el !== 'X') {
          return false;
        }
        return true;
      }, true);

      if (gameWon) break;
    }

    // Check columns if game not won yet:
    if (!gameWon) {
      for (let j = 0; j < 5; j += 1) {
        let winner = true;
        for (let k = 0; k < 5; k += 1) {
          if (boards[i][k][j] !== 'X') {
            winner = false;
            break;
          }
        }
        if (winner) {
          gameWon = true;
          break;
        }
      }
    }

    if (gameWon) {
      winners.push(i);
    }
  }

  // No winner
  return winners.length ? winners : [-1];
}

// console.log(
//   checkBoards([
//     [
//       ['X', '10', 'X', 'X', 'X'],
//       ['10', '10', '10', '10', '10'],
//       ['X', '10', 'X', 'X', 'X'],
//       ['X', '10', 'X', 'X', 'X'],
//       ['X', '10', 'X', 'X', 'X'],
//     ],
//   ])
// );

module.exports = checkBoards;
