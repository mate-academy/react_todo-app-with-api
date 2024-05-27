import React, { useContext, useEffect } from 'react';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: React.FC = () => {
  const { loader, selectedFilter, lastTodo, showFilteredTodos } = useContext(TodosContext);

  const filteredTodos = showFilteredTodos(selectedFilter);

  useEffect(() => {
    console.log(lastTodo, loader);
  }, [lastTodo, loader]); // Додано loader до залежностей

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((item: Todo) => (
        <TodoItem key={item.id.toString()} todo={item} />
      ))}
      {lastTodo && (
        <TodoItem key={lastTodo.id.toString()} todo={lastTodo} />
      )}
    </section>
  );
};
