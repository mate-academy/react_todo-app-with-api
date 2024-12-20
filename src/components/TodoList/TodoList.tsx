/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  onToggleTodo: (id: number) => void;
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Todo) => Promise<void>;
  deletingId: number[];
  filteredTodos: Todo[];
  setErrorMessage: (message: string) => void;
  loadingIds: number[];
  tempTodo: Todo | null;
};

export const Todolist: React.FC<Props> = ({
  onDelete,
  onUpdate,
  deletingId,
  filteredTodos,
  setErrorMessage,
  loadingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          deletingId={deletingId}
          filteredTodos={filteredTodos}
          setErrorMessage={setErrorMessage}
          loadingIds={loadingIds}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          deletingId={deletingId}
          filteredTodos={filteredTodos}
          setErrorMessage={setErrorMessage}
          loadingIds={loadingIds}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
