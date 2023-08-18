/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import isEqual from 'lodash.isequal';
import { Todo } from '../types/Todo';

export function getCompletedTodos(todos: Todo[]) {
  return todos.filter(todo => todo.completed);
}

export function getActiveTodos(todos: Todo[]) {
  return todos.filter(todo => !todo.completed);
}

export function compareLocalAndServerTodos(local: Todo[], server: Todo[]) {
  if (local.length !== server.length) {
    return false;
  }

  local.forEach(localTodo => {
    const accordanceById = server.filter(serverTodo => serverTodo.id === localTodo.id)[0];

    if (!accordanceById) {
      return false;
    }

    if (!isEqual(localTodo, accordanceById)) {
      return false;
    }

    return true;
  });

  return true;
}
