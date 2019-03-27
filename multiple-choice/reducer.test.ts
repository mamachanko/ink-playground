import { moveSelectionDown, moveSelectionUp, reducer, State } from './reducer';

describe('reducer', () => {

    it('moves selection down', () => {
        const state: State = {
            before: [],
            selected: 'answer 1',
            after: [
                'answer 2',
                'answer 3'
            ]
        }
        const nextState: State = reducer(state, moveSelectionDown());

        expect(nextState).toStrictEqual({
            before: ['answer 1'],
            selected: 'answer 2',
            after: ['answer 3']
        });
    });

    it('moves selection further down', () => {
        const state: State = {
            before: ['answer 1'],
            selected: 'answer 2',
            after: ['answer 3']
        }
        const nextState: State = reducer(state, moveSelectionDown());

        expect(nextState).toStrictEqual({
            before: ['answer 1', 'answer 2'],
            selected: 'answer 3',
            after: []
        });
    });

    it('moves selection down and around', () => {
        const state: State = {
            before: [
                'answer 1',
                'answer 2'
            ],
            selected: 'answer 3',
            after: []
        }
        const nextState: State = reducer(state, moveSelectionDown());

        expect(nextState).toStrictEqual({
            before: [],
            selected: 'answer 1',
            after: [
                'answer 2',
                'answer 3'
            ]
        });
    });

    it('moves selection up and around', () => {
        const state: State = {
            before: [],
            selected: 'answer 1',
            after: [
                'answer 2',
                'answer 3'
            ]
        }
        const nextState: State = reducer(state, moveSelectionUp());

        expect(nextState).toStrictEqual({
            before: [
                'answer 1',
                'answer 2'
            ],
            selected: 'answer 3',
            after: []
        });
    });

    it('moves selection further up', () => {
        const state: State = {
            before: ['answer 1'],
            selected: 'answer 2',
            after: ['answer 3']
        }
        const nextState: State = reducer(state, moveSelectionUp());

        expect(nextState).toStrictEqual({
            before: [],
            selected: 'answer 1',
            after: ['answer 2', 'answer 3']
        });
    });

    it('moves selection up', () => {
        const state: State = {
            before: [
                'answer 1',
                'answer 2'
            ],
            selected: 'answer 3',
            after: []
        }
        const nextState: State = reducer(state, moveSelectionUp());

        expect(nextState).toStrictEqual({
            before: ['answer 1'],
            selected: 'answer 2',
            after: ['answer 3']
        });
    });

});