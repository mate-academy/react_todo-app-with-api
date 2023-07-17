import { Dispatch, SetStateAction } from 'react';
import { FilterStatus, Todo } from '../types/Types';

export const showError = (
  errorText : string, setError: Dispatch<SetStateAction<string>>,
) => {
  setError(errorText);
  setTimeout(() => setError(''), 3000);
};

export const getFilteredTodos = (todos: Todo[], filter: FilterStatus) => (
  todos.filter(todo => {
    switch (filter) {
      case FilterStatus.COMPLETED:
        return todo.completed;

      case FilterStatus.ACTIVE:
        return !todo.completed;

      default:
        return todo;
    }
  })
);
