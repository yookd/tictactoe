import React        from 'react';
import TTTBoardCell from 'components/TTTBoard/TTTBoardCell';

export default class TTTBoard extends React.Component {

  /**
   * Set the correct class for the individual board cell
   *
   * @param {number} cellIndex - index of the cell in boardState
   */
  _getCellClass = (cellIndex) => {

    // Set colLength to 12 (for bootstrap)
    const colLength = 12;
    let boardSize = this.props.board.size;
    let totalSize = this.props.board.size * this.props.board.size;
    let cellClass = 'col-xs-' + (colLength / boardSize);

    // Top row
    if(cellIndex < boardSize) {
      cellClass += ' board-cell top';
    // Bottom row
    } else if(cellIndex >= (totalSize - boardSize)
      && cellIndex < (totalSize)) {
      cellClass += ' board-cell bottom';
    } else {
      cellClass += ' board-cell';
    }

    // Left and right cells
    if(cellIndex % boardSize === 0) {
      cellClass += ' left';
    } else if((cellIndex % boardSize) === (boardSize - 1)) {
      cellClass += ' right';
    }

    return cellClass.trim();
  }

  /**
   * Display winner or turn
   *
   * @param {object} board - board object
   */
  _displayTitle = (board) => {
    if(board.winner.length) {
      if(board.winner === 'D') {
        return 'Draw!';
      } else {
        return board.winner + ' wins!';
      }
    } else {
      return board.turn + "'s turn";
    }
  }

  /**
   * Adds a wrapper div to every n cell where n is the size of col/row
   *
   */
  _constructCellRows = () => {
    let index = 0;
    let groups = [];
    let children = [];
    let components = this.props.board.boardState.map( (state, cellIndex) => {
      return (
        <TTTBoardCell
          cellIndex={ cellIndex }
          cellState={ state }
          classes={ this._getCellClass(cellIndex) }
          boardIndex={ this.props.boardIndex }
          key={ cellIndex + state }
          handleCellClick={ this.props.handleCellClick }
        />
      );
    }).toJS();

    while(components.length > 0) {
      children.push(components.shift());

      // For every n cells where n is the size, wrap it in a row
      if(children.length % this.props.board.size === 0) {
        groups.push(
          <div className="board-row row" key={ index }>
            { children }
          </div>
        );

        children = [];
        index++;
      }
    }

    return (
      <div className="board">
        { groups }
      </div>
    );
  }

  render() {
    const { board, boardIndex, handleDelete, handleRestart } = this.props;

    return (
      <div className="board-wrapper">
        <div className="row">
          <div className="col-xs-offset-2 col-xs-8 col-sm-offset-2 col-sm-8">
            { this._constructCellRows() }
          </div>
        </div>
        <div className="row">
          <div className="col-xs-offset-2 col-xs-8 col-sm-offset-2 col-sm-8">
            <div className="board-details">
              <h2>{ this._displayTitle(board) }</h2>
              <div className="board-actions">
                <button
                  data-board-id={ boardIndex }
                  onClick={ handleRestart }
                  type="button"
                  className="btn btn-restart btn-default"
                >
                  Restart
                </button>
                <button
                  data-board-id={ boardIndex }
                  onClick={ handleDelete }
                  type="button"
                  className="btn btn-danger"
                >
                  Quit Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}