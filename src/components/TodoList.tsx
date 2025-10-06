import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onSelect?: (todo: Todo) => void;
  onUpdate: (todoId: number, newTitle: string) => Promise<void>;
  deletingTodoId: number[];
  updatingTodoId: number[];
};

// eslint-disable-next-line max-len
export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onSelect,
  deletingTodoId,
  updatingTodoId,
  onUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(e => (
      <TodoItem
        key={e.id}
        todo={e}
        onDelete={onDelete}
        onSelect={onSelect}
        deletingTodoId={deletingTodoId}
        updatingTodoId={updatingTodoId}
        data-cy="Todo"
        onUpdate={onUpdate}
      />
    ))}
  </section>
);
