import React from 'react';

export default class TTTBoardCell extends React.Component {
  /**
   * Lower case the cell class
   *
   * @param {string} cellState - state of the cell
   */
  _setCellClass = (cellState) => {
    return cellState.toLowerCase();
  }

  render() {
    const {
      cellIndex,
      cellState,
      boardIndex,
      handleCellClick,
      classes
    } = this.props;

    return (
      <div
        className={ classes }
        data-cell-id={ cellIndex }
        data-board-id={ boardIndex }
        onClick={ this.props.handleCellClick }
      >
        <div className={ this._setCellClass(cellState) } ></div>
      </div>
    );
  }
}