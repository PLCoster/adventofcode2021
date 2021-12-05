/**
 * Calculates the score of a winning board
 * Score is the sum of all unmarked numbers multiplied by the last called number
 * @param {String[][]} board Single 5 x 5 winning game board
 * @param {Number} num Last number called that resulted in the winning board
 * @return
 */
function calculateScore(board, num) {
  let score = 0;
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board.length; j += 1) {
      if (board[i][j] !== 'X') {
        score += parseInt(board[i][j]);
      }
    }
  }
  return score * num;
}

module.exports = calculateScore;
