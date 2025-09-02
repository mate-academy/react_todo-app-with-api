import React from 'react';
import { Todo } from '../types/todos';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  editId: number | null;
  pendingIds: number[];
  onUpdate: (id: number, data: Partial<Todo>) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onEdit: (id: number) => void;
  onSave: (id: number, newValue: string, oldValue: string) => Promise<void>;
  onFormSave: (
    e: React.FormEvent<HTMLFormElement>,
    id: number,
    old: string,
  ) => Promise<void>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  editId,
  pendingIds,
  onUpdate,
  onDelete,
  onEdit,
  onSave,
  onFormSave,
  onKeyDown,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        editId={editId}
        pendingIds={pendingIds}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={onEdit}
        onSave={onSave}
        onFormSave={onFormSave}
        onKeyDown={onKeyDown}
      />
    ))}
  </section>
);
