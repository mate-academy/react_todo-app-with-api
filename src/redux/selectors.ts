import { createSelector } from '@reduxjs/toolkit';
import { TodoFilter } from '../types/TodoFilter';
import { RootState } from './store';

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectFilter = (state: RootState) => state.todos.currentFilter;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case TodoFilter.Active:
        return todos.filter(todo => !todo.completed);
      case TodoFilter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  },
);

export const selectRenamingTodoId
  = (state: RootState) => state.todos.renamingTodoId;
