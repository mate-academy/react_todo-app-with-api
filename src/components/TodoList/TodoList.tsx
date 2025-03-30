import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number[]) => Promise<void>;
  tempTodo: Todo | null;
  deletedTodo: number[];
  adding: boolean;
  onUpdate: (el: Todo[]) => Promise<void>;
  errorMessage: string;
  updatedTodo: Todo[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletedTodo,
  tempTodo,
  adding,
  onUpdate,
  updatedTodo,
  errorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          updatedTodo={updatedTodo}
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          deletedTodo={deletedTodo}
          onUpdate={onUpdate}
          errorMessage={errorMessage}
        />
      ))}

      {tempTodo && (
        <TodoItem
          updatedTodo={updatedTodo}
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={onDelete}
          deletedTodo={deletedTodo}
          adding={adding}
          errorMessage={errorMessage}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};
