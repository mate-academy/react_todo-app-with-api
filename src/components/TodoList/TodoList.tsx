import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  filteredTodos: Todo[];
  deletingIds: number[];
  updatingIds: number[];
  editingId: number | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  handleEditStart: (id: number, title: string) => void;
  handleEditSubmit: (id: number, oldTitle: string) => void;
  handleEditKeyUp: (
    e: React.KeyboardEvent,
    id: number,
    oldTitle: string,
  ) => void;
  handleToggle: (id: number, completed: boolean) => void;
  handleDelete: (id: number) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deletingIds,
  updatingIds,
  editingId,
  editTitle,
  setEditTitle,
  handleEditStart,
  handleEditSubmit,
  handleEditKeyUp,
  handleToggle,
  handleDelete,
  editInputRef,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isDeleting={deletingIds.includes(todo.id)}
        isUpdating={updatingIds.includes(todo.id)}
        isEditing={editingId === todo.id}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        onEditStart={handleEditStart}
        onEditSubmit={handleEditSubmit}
        onEditKeyUp={handleEditKeyUp}
        onToggle={handleToggle}
        onDelete={handleDelete}
        editInputRef={editInputRef}
      />
    ))}
  </section>
);
