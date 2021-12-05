/**
 *
 * @param {String[]} input Puzzle input as array of strings
 * @returns {String[][][]} Array containing 5x5 game boards with string values
 */
function generateBoards(input) {
  const boards = [];
  let board = [];

  for (let i = 1; i < input.length; i += 1) {
    if (board.length === 5) {
      boards.push(board);
      board = [];
    }

    if (input[i] === '') {
      continue;
    }

    board.push([...input[i].split(' ').filter((el) => el !== '')]);
  }

  return boards;
}

module.exports = generateBoards;
