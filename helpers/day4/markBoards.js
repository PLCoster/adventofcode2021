/**
 * Replaces 'num' in all boards with 'X' to mark number as being called
 * Mutates array of game boards
 * @param {String[][][]} boards Array of 5x5 bingo boards
 * @param {Number} num Number that has been called and will be marked
 */
function markBoards(boards, num) {
  for (let i = 0; i < boards.length; i += 1) {
    const board = boards[i];

    // If board removed from play due to winning, continue:
    if (!board.length) {
      continue;
    }

    for (let j = 0; j < 5; j += 1) {
      // Map matching values to 'X'
      board[j] = board[j].map((boardNum) => {
        if (boardNum === num) {
          return 'X';
        }
        return boardNum;
      });
    }
  }
}

// const testBoards = [
//   [
//     ['X', '10', 'X', 'X', 'X'],
//     ['10', '10', '10', '10', '10'],
//     ['X', '10', 'X', 'X', 'X'],
//     ['X', '10', 'X', 'X', 'X'],
//     ['X', '10', 'X', 'X', 'X'],
//   ],
// ];

// markBoards(testBoards, '10');
// console.log(testBoards);

module.exports = markBoards;
