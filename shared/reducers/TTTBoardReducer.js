import Immutable            from 'immutable';
import { combineReducers }  from 'redux';
import * as Helpers         from '../../utils/helpers';

const defaultState = new Immutable.List();

/**
 * Set an empty board
 *
 * @param {number} size - size of row/col for board
 */
function createBoardState(size = 3) {
  const boardState = new Immutable.List();
  let spaces = size * size;
  let result;

  for(let cell = 0; cell < spaces; ++cell) {
    if(result) {
      result = result.insert(cell, 'E');
    } else {
      result = boardState.insert(cell, 'E');
    }
  }

  return result;
}

/**
 * Randomly set a turn
 *
 */
function randomizeTurn() {
  let possible = "XO";

  return possible.charAt(Math.floor(Math.random() * possible.length));
}

/**
 * Find out if we returned a winner from any result
 *
 * @param {list} state - immutable list of previous state
 * @param {list} newState - immutable list of new state
 */
function _determineBoardState(state, newState) {
  return state.map( (board, index) => {
    if(index === newState.id) {
      return {
        ...board,
        boardState: board.boardState.set(newState.cellIndex, newState.turn)
      }
    }

    return board;
  });
}

/**
 * Find out if we returned a winner from any result
 *
 * @param {list} result - resulting array of row, col or diagonal
 * @param {number} size - number of cells in a given row/col
 */
function _isWinnerFound(result, size) {

  // There must be no empty spaces, length of the array must equal size,
  // and there should be one unique item.
  if(result[0] !== 'E' &&
    result.length === size &&
    Helpers.unique(result).length === 1) {

    return true;
  } else {

    return false;
  }
}

/**
 * Determine if there is a row winner
 *
 * @param {list} boardState - immutable list of the board state
 * @param {number} boardLength - size of the entire board (3 or 4)
 * @param {number} size - number of cells in a given row/col
 */
function _determineRowWinner(boardState, boardLength, size) {
  let winner = '';

  for(let cell = 0; cell <= boardLength - size; cell += size) {
    let col = cell;
    let rowResult = [];
    let rowLimit = col + size;

    while(col < rowLimit) {
      rowResult.push(boardState.get(col));

      col++;
    }

    // Found winner
    if(_isWinnerFound(rowResult, size)) {
      winner = rowResult[0];

      break;
    }
  }

  return winner;
}

/**
 * Determine if there is a column winner
 *
 * @param {list} boardState - immutable list of the board state
 * @param {number} boardLength - size of the entire board (3 or 4)
 * @param {number} size - number of cells in a given row/col
 */
function _determineColWinner(boardState, boardLength, size) {
  let winner = '';

  for(let cell = 0; cell < size; ++cell) {
    let row = cell;
    let colResult = [];

    while(row < boardLength) {
      colResult.push(boardState.get(row));

      row += size;
    }

    if(_isWinnerFound(colResult, size)) {
      winner = colResult[0];

      break;
    }
  }

  return winner;
}

/**
 * Determine if there is a diagonal winner
 *
 * @param {list} boardState - immutable list of the board state
 * @param {number} boardLength - size of the entire board (3 or 4)
 * @param {number} size - number of cells in a given row/col
 */
function _determineDiagWinner(boardState, boardLength, size) {
  let winner = '';

  for(let cell = 0, next = size + 1;
    cell < size;
    cell += size - 1, next -= size - 1) {

    let cross = cell;
    let result = [];
    let i = 0;
    let diagLength = size;

    // Diagonal length will always be the size specified
    while(i < diagLength) {
      result.push(boardState.get(cross));

      cross += next;
      i++;
    }

    if(_isWinnerFound(result, size)) {
      winner = result[0];

      break;
    }
  }

  return winner;
}

/**
 * Determine if the board is a draw
 *
 * @param {list} boardState - immutable list of the board state
 * @param {number} boardLength - size of the board (3 or 4)
 */
function _determineDraw(boardState, boardLength) {
  let availableSpaces = false;
  let winner = '';

  for(let cell = 0; cell < boardLength; ++cell) {
    if(boardState.get(cell) === 'E') {
      availableSpaces = true;
      break;
    }
  }

  // If there are no empty cells, there is a draw
  if(!availableSpaces) {
    winner = 'D';
  }

  return winner;
}

/**
 * Determine winner of the game
 *
 * @param {list} prevState - immutable list of the previous state
 * @param {list} newState - immutable list of new state
 */
function _determineWinner(prevState, newState) {
  const boardState = prevState.get(newState.id).boardState;
  const boardLength = prevState.get(newState.id).boardState.size;
  const size = prevState.get(newState.id).size;

  let winner = _determineRowWinner(boardState, boardLength, size);

  /**
   * We don't want to run additional checks if we find a winner since
   * it can get expensive
   */
  if(!winner.length) {
    winner = _determineColWinner(boardState, boardLength, size);
  }

  if(!winner.length) {
    winner = _determineDiagWinner(boardState, boardLength, size);
  }

  // Determine draw last since there will be a winner by the time it gets here
  if(!winner.length) {
    winner = _determineDraw(boardState, boardLength, size);
  }

  return prevState.map( (board, index) => {
    if(index === newState.id) {
      return {
        ...board,
        winner: winner
      }
    }

    return board;
  });
}

/**
 * Toggle the turn
 *
 * @param {list} prevState - immutable list of the previous state
 * @param {list} newState - immutable list of new state
 */
function _determineTurn(prevState, newState) {
  return prevState.map( (board, index) => {
    if(index === newState.id) {
      return {
        ...board,
        turn: (board.turn === 'O' ? 'X' : 'O')
      }
    }

    return board;
  });
}

/**
 * Ensure that each turn is valid
 *
 * @param {list} prevState - immutable list of the previous state
 * @param {list} newState - immutable list of new state
 */
function _isValidTurn(prevState, newState) {
  let cellValue = prevState.get(newState.id).boardState.get(newState.cellIndex);
  let winner = prevState.get(newState.id).winner;

  // Validate value at the cell that the player is playing a move is empty
  if(cellValue !== 'E')  {
    return false;
  }

  // Validate that we don't have a winner
  if(winner.length) {
    return false;
  }

  return true;
}

/**
 * Update board based on cell
 *
 * @param {list} prevState - immutable list of the previous state
 * @param {list} newState - immutable list of new state
 */
function updateBoard(prevState, newState) {
  if(_isValidTurn(prevState, newState)) {
    let newBoardState = _determineBoardState(prevState, newState);
    newBoardState = _determineWinner(newBoardState, newState);
    newBoardState = _determineTurn(newBoardState, newState);

    return newBoardState;
  } else {
    return prevState;
  }
}

/**
 * Reset board to default settings
 *
 * @param {list} prevState - immutable list of the previous state
 * @param {number} id - id of board to reset
 */
function restartBoard(prevState, id) {
  return prevState.map( (board, index) => {
    if(index === id) {
      return {
        ...board,
        winner: '',
        boardState: createBoardState(prevState.get(id).size),
        turn: (board.turn === 'O' ? 'X' : 'O')
      }
    }

    return board;
  });
}

export default function tttBoardReducer(state = defaultState, action) {
  switch(action.type) {
    case 'CREATE_TTT_BOARD':
      return state.concat({
        size: action.size || 3,
        winner: '',
        turn: randomizeTurn(),
        boardState: createBoardState(action.size)
      });
    case 'UPDATE_TTT_BOARD':
      const updatedState = updateBoard(state, action.board);
      return state.set(action.board.id, updatedState.get(action.board.id));
    case 'RESTART_TTT_BOARD':
      const resetState = restartBoard(state, action.id);
      return state.set(action.id, resetState.get(action.id));
    case 'DELETE_TTT_BOARD':
      return state.delete(action.id);
    default:
      return state;
  }
}