if (process.env.BROWSER) {
  require('../assets/main.scss');
}

import React                  from 'react';
import { bindActionCreators } from 'redux';
import * as TTTBoardActions   from 'actions/TTTBoardActions';
import TTTBoardsView          from 'components/TTTBoard/TTTBoardsView';
import { connect }            from 'react-redux';

@connect(state => ({ boards: state.boards }))

export default class Home extends React.Component {
  render() {
    const { boards, dispatch } = this.props;
    const boundActionCreators  = bindActionCreators(TTTBoardActions, dispatch);
    return (
      <TTTBoardsView
        boards={ boards }
        { ...boundActionCreators }
      />
    );
  }

}