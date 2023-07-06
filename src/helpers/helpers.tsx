import { Dispatch, SetStateAction } from 'react';
import { FilterStatus, Todo } from '../types/Todo';

export const showError = (
  errorText : string, setError: Dispatch<SetStateAction<string>>,
) => {
  setError(errorText);
  setTimeout(() => setError(''), 3000);
};

export const GetFilteredTodos = (todos: Todo[], filter: FilterStatus) => (
  todos.filter(todo => {
    switch (filter) {
      case FilterStatus.COMPLETED:
        return todo.completed;
        break;

      case FilterStatus.ACTIVE:
        return !todo.completed;
        break;

      default:
        return todo;
        break;
    }
  })
);
