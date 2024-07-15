import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { Loading } from '../../types';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingId: Loading;
  onEdit: (
    todo: Todo,
    key: keyof Todo,
    value: boolean | string,
  ) => Promise<boolean>;
  onDelete: (todoID: number) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingId,
  onEdit,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        loadingId={loadingId}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}

    {tempTodo !== null && (
      <TodoItem
        todo={tempTodo}
        onDelete={onDelete}
        loadingId={loadingId}
        onEdit={onEdit}
      />
    )}
  </section>
);
