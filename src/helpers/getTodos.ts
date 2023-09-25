import { FiltersType } from '../types/filterTypes';
import { TodosListType } from '../types/todosTypes';

export const getCompletedTodos
  = (todos: TodosListType) => todos.filter(({ completed }) => completed);

export const getActiveTodos
  = (todos: TodosListType) => todos.filter(({ completed }) => !completed);

const getFilteredTodos
  = (todos: TodosListType, filter: FiltersType): TodosListType => {
    switch (filter) {
      case FiltersType.ALL:
      default:
        return todos;

      case FiltersType.ACTIVE:
        return getActiveTodos(todos);

      case FiltersType.COMPLETED:
        return getCompletedTodos(todos);
    }
  };

export default getFilteredTodos;
