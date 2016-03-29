export function createTTTBoard(size) {
  return {
    type: 'CREATE_TTT_BOARD',
    size
  };
}

export function updateTTTBoard(board) {
  return {
    type: 'UPDATE_TTT_BOARD',
    board
  }
}

export function restartTTTBoard(id) {
  return {
    type: 'RESTART_TTT_BOARD',
    id
  }
}

export function deleteTTTBoard(id, board) {
  return {
    type: 'DELETE_TTT_BOARD',
    id,
    board
  }
}