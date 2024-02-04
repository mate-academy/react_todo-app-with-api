import { Todo } from '../types/Todo';
import { TodosFilterQuery } from '../types/TodosFilterQuery';

const getPreparedTodos = (todos:Todo[], query:TodosFilterQuery) => {
  switch (query) {
    case TodosFilterQuery.active:
      return todos.filter(todo => !todo.completed);
    case TodosFilterQuery.completed:
      return todos.filter(todo => todo.completed);
    case TodosFilterQuery.all:
      return todos;
    default:
      return todos;
  }
};

export default getPreparedTodos;
