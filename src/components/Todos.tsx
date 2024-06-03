import { Todo } from '../types/Todo';
import React, { useMemo } from 'react';
import { TodoItem } from './TodoItems';
import { useTodosContext } from '../context/TodoContext';
import { getFilteredTodos } from '../getFilteredTodos/getFilteredTodos';

export const Todos: React.FC = () => {
  const { todos, tempTodo, status } = useTodosContext();

  const preparedTodos = useMemo(() => {
    return getFilteredTodos(todos, status);
  }, [todos, status]);

  return (
    <>
      {preparedTodos.map((todo: Todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} key={tempTodo.id} />}
    </>
  );
};
