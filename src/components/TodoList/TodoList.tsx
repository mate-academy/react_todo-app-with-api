import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  toggleTodo: (todo: Todo) => void;
  activeTodoId: number | null,
  isLoading: boolean,
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    deleteTodo,
    toggleTodo,
    activeTodoId,
    isLoading,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          activeTodoId={activeTodoId}
          isLoading={isLoading}
        />
      ))}
    </section>
  );
};
