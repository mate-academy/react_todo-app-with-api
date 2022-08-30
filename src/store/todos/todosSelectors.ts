import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectFilter = (state: RootState) => state.todos.filter;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => todos ? todos.filter(todo => filter ? filter === 'completed' ? todo.completed : !todo.completed : true) : null
)

export const selectActiveTodos = createSelector(
  [selectTodos],
  (todos) => todos ? todos.filter(todo => !todo.completed) : null
)

export const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => todos ? todos.filter(todo => todo.completed) : null
)
