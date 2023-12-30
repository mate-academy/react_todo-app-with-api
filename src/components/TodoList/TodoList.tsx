import React, { useContext } from 'react';
import { TodosContext } from '../TododsContext/TodosContext';
import { FilterOption } from '../../types/FilterOption';
import { TodoItem } from '../TodoItem';

export const TodoList: React.FC = () => {
  const {
    todos, filterOption,
  } = useContext(TodosContext);

  const filteredTodos = todos.filter(todo => {
    switch (filterOption) {
      case FilterOption.Active:
        return !todo.completed;

      case FilterOption.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
          />
        );
      })}
    </section>
  );
};
