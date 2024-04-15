import React, { useMemo } from 'react';
import { useTodosContext } from '../context/useTodosContext';
import { TodoItem } from './TotoItem';
import { getFilteredTodos } from '../services/getFilteredTodos';
import { Todo } from '../types/Todo';

export const TodoList: React.FC = () => {
  const { todos, tempTodo, query } = useTodosContext();

  const todosToGo = useMemo(() => {
    return getFilteredTodos(todos, query);
  }, [todos, query]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToGo.map((todo: Todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
