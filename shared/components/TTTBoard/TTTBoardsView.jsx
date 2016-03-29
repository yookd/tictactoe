import React    from 'react';
import TTTBoard from 'components/TTTBoard/TTTBoard';

export default class TTTBoardsView extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      boardSize: 3,
      validator: {
        min: 3,
        max: 4,
        number: true
      },
    };
  }

  /**
   * Set the display header
   *
   */
  _setHeader = () => {
    if(!this.props.boards.size) {
      return (
        <div className="board-form-header">
          <h2>Tic Tac Toe</h2>
          <p>ENTER BOARD SIZE:</p>
        </div>
      );
    } else {
      return (
        <div className="board-form-header">
          <p>ENTER BOARD SIZE:</p>
        </div>
      );
    }
  }

  /**
   * Delete a board
   *
   * @param {object} e - event
   */
  handleDelete = (e) => {
    const id = Number(e.target.dataset.boardId);

    this.props.deleteTTTBoard(id);
  }

  /**
   * Reset a board
   *
   * @param {object} e - event
   */
  handleRestart = (e) => {
    const id = Number(e.target.dataset.boardId);

    this.props.restartTTTBoard(id);
  }

  /**
   * Create a board
   *
   * @param {object} e - event
   */
  handleCreate = (e) => {
    const boardSize = Number(this.state.boardSize);

    // Basic input validation
    // Ideally the form would be its own component that handles all validations.
    if(boardSize < this.state.validator.min ||
      boardSize > this.state.validator.max ||
      isNaN(boardSize)) {
      return;
    }

    this.props.createTTTBoard(boardSize);
  }

  /**
   * Update the board
   *
   * @param {object} e - event
   */
  handleCellClick = (e) => {
    const id = Number(e.target.dataset.boardId);
    const updates = {
      id: id,
      cellIndex: Number(e.target.dataset.cellId),
      turn: this.props.boards.get(id).turn
    };

    this.props.updateTTTBoard(updates);
  }

  /**
   * Handle size input
   *
   * @param {object} e - event
   */
  handleBoardSizeInput = (e) => {
    e.preventDefault();

    let size = e.target.value;

    this.setState({
      boardSize: size
    });
  }

  render() {
    return (
      <div id="board-list">
        {
          this.props.boards.map( (board, index) => {
            return (
              <TTTBoard
                key={ index }
                board={ board }
                boardIndex={ index }
                handleDelete={ this.handleDelete }
                handleCellClick={ this.handleCellClick }
                handleRestart={ this.handleRestart }
              />
            );
          })
        }
        <div className="row">
          <div id="board-form" className="col-xs-12 col-sm-offset-3 col-sm-6">
            { this._setHeader() }
            <div className="input-row row">
              <input
                className="col-xs-offset-2 col-sm-offset-0 col-xs-3 col-sm-4 col-md-4"
                type="text"
                onChange={ this.handleBoardSizeInput }
                placeholder="3"
                defaultValue={ this.state.boardSize }
                autoFocus
              />
              <p className="col-xs-2 col-sm-4 col-md-4">&nbsp;x&nbsp;</p>
              <input
                className="col-xs-3 col-sm-4 col-md-4 not-allowed"
                type="text"
                placeholder="3"
                value={  this.state.boardSize }
                readOnly
              />
            </div>
            <div className="input-row row">
              {
                (Number(this.state.boardSize) > this.state.validator.max ||
                  Number(this.state.boardSize) < this.state.validator.min)
                  ? <p className="error">Please enter a value between 3 and 4.</p>
                  : ''
              }
              {
                (isNaN(Number(this.state.boardSize)))
                  ? <p className="error">Please enter a number.</p>
                  : ''
              }
            </div>
            <div className="input-row row">
              <button
                type="button"
                className="col-xs-offset-2 col-xs-8 col-sm-offset-0 col-sm-12 btn btn-success"
                onClick={ this.handleCreate }
              >
                + New Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}