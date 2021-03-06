'use strict';

const expect = require('expect');
const deepFreeze = require('deep-freeze');
const Redux = require('redux');

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };

        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }

            return Object.assign({},
                state,
                { completed: !state.completed }
            );

        default:
            return state;
    }
}

const todos = (state, action) => {
    if (!state) state = [];

    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];

        case 'TOGGLE_TODO':
            return  state.map(t => todo(t, action));

        default:
            return state;
    }
};

const visibilityFilter = (state, action) => {
    if (!state) state = 'SHOW_ALL';

    switch(action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const combineReducers = Redux.combineReducers;

const todoApp = combineReducers({ todos, visibilityFilter });

// EXECUTION

const createStore = Redux.createStore;
const store = createStore(todoApp);

console.log('Initial state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching ADD_TODO.');
store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
});

console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching ADD_TODO.');
store.dispatch({
    type: 'ADD_TODO',
    id: 1,
    text: 'Go shopping'
});

console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching TOGGLE_TODO.');
store.dispatch({
    type: 'TOGGLE_TODO',
    id: 0
});

console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching SET_VISIBILITY_FILTER.');
store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter: 'SHOW_COMPLETED'
});

console.log('Current state:');
console.log(store.getState());
console.log('--------------');



// TESTS

const testAddTodo = () => {
    const stateBefore = [];

    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    };

    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: false
        }
    ];

    const action = {
        type: 'TOGGLE_TODO',
        id: 1
    };

    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: true
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

testToggleTodo();
testAddTodo();
console.log('All testes passed.');
