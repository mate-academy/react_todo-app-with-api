import React, { useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: React.FC = () => {
  const { todos, selectedFilter, lastTodo, showFilteredTodos } =
    useContext(TodosContext);

  const filteredTodos = showFilteredTodos(selectedFilter);
  const deletedElement = todos.find(ietm => ietm.id === lastTodo?.id);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((item: Todo) => (
        <TodoItem key={item.id.toString()} todo={item} />
      ))}
      {lastTodo && !deletedElement && <TodoItem key={lastTodo.id.toString()} todo={lastTodo} />}
    </section>
  );
};
