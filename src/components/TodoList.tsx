import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onDelete: (id: number) => void,
  tempTodo: Todo | null,
  updatedTodos: (todo: Todo) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  updatedTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          updateTodos={updatedTodos}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
        />
      )}
    </section>
  );
};
