/**
 * Represents a Todo item.
 * @typedef {Object} Todo
 * @property {number} id - The unique identifier of the todo item.
 * @property {number} userId - The unique identifier of the user who created the todo item.
 * @property {string} title - The title of the todo item.
 * @property {boolean} completed - Indicates whether the todo item has been completed or not.
 */
export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
