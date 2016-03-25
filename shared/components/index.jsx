import React from 'react';

export default class AppView extends React.Component {
  render() {
    return (
      <div id="app-view">
        <h1>Tic Tac Toe</h1>
        { this.props.children }
      </div>
    );
  }
}