import React from 'react';
import { useTodos } from '../utils/TodoContext';
import { getVisibleTodos } from '../utils/getVisibleTodos';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { todos, status, tempTodo } = useTodos();
  const visibleTodos = getVisibleTodos(todos, status);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
