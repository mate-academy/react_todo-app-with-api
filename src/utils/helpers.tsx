import { Todo } from '../types/Todo';
/**
 * Calculates a new ID for a new todo item based on an array of existing todos.
 *
 * @param {Todo[]} todosArray - An array of existing todo items.
 * @returns {number} - A new ID that is one greater than the highest existing ID in the array.
 */
export const getNewTodoId = (todosArray: Todo[]) => {
  return Math.max(...todosArray.map(todo => todo.id)) + 1;
};
