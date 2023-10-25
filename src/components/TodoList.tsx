import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  isUpdating: number[];
  updateTodo: (todo: Todo) => Promise<void | Todo>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  deleteTodo,
  isUpdating,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          isUpdating={isUpdating}
          updateTodo={updateTodo}
        />
      ))}
    </section>
  );
};
