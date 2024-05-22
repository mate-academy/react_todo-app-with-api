import React, { useContext } from 'react';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: React.FC = () => {
  const { loader, setLoader, selectedFilter, lastTodo, showFilteredTodos } =
    useContext(TodosContext);

  setLoader(true);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {showFilteredTodos(selectedFilter).map((item: Todo) => (
        <TodoItem key={item.id.toString()} todo={item} />
      ))}
      {lastTodo && loader && (
        <TodoItem key={lastTodo.id.toString()} todo={lastTodo} />
      )}
    </section>
  );
};
