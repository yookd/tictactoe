import { List, fromJS } from 'immutable';
import { expect }       from 'chai';
import reducer          from '../../shared/reducers/TTTBoardReducer';

describe('TTTBoardReducer', () => {

  // Create
  describe('CREATE_TTT_BOARD', () => {
    describe('default create', () => {
      let nextState;

      before(function() {
        const initialState = List();
        const action = {
          type: 'CREATE_TTT_BOARD',
          size: 3
        };
        nextState = reducer(initialState, action);
      });

      it('should create a list with a board', () => {
        expect(nextState).to.have.size(1);
      });

      it('should set board state to all Empty', () => {
        expect(nextState.toJS()[0].boardState).to.have.size(9);
      });

      it('should have an empty winner', () => {
        expect(nextState.toJS()[0].winner).to.equal('');
      });
    });

    describe('create with size 4', () => {
      let nextState;

      before(function() {
        const initialState = List();
        const action = {
          type: 'CREATE_TTT_BOARD',
          size: 4
        };
        nextState = reducer(initialState, action);
      });

      it('should create a list with a board', () => {
        expect(nextState).to.have.size(1);
      });

      it('should set board state to all Empty', () => {
        expect(nextState.toJS()[0].boardState).to.have.size(16);
      });

      it('should have an empty winner', () => {
        expect(nextState.toJS()[0].winner).to.equal('');
      });
    });
  });
});