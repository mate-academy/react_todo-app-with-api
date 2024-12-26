import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { FilterType } from '../types/FilterType';

export const USER_ID = 2136;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>('/todos', { ...newTodo, userId: USER_ID });
};

export function updateTodo(todo: Todo) {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
}

export const filterTodos = (todos: Todo[], filteredField: FilterType) => {
  return todos.filter(todo => {
    switch (filteredField) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return todos;
    }
  });
};
