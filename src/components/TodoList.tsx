import React from 'react';

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: Set<number>;
  editingTodoId: number | null;
  editTitle: string;
  editInputRef: React.RefObject<HTMLInputElement>;

  onToggle: (todo: Todo) => void;
  onDelete: (todoId: number) => void;
  onEditStart: (todo: Todo) => void;
  onEditChange: (value: string) => void;
  onEditSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  onEditKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  editingTodoId,
  editTitle,
  editInputRef,
  onToggle,
  onDelete,
  onEditStart,
  onEditChange,
  onEditSubmit,
  onEditKeyUp,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.has(todo.id)}
          isEditing={editingTodoId === todo.id}
          editTitle={editTitle}
          editInputRef={editInputRef}
          onToggle={onToggle}
          onDelete={onDelete}
          onEditStart={onEditStart}
          onEditChange={onEditChange}
          onEditSubmit={onEditSubmit}
          onEditKeyUp={onEditKeyUp}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          isEditing={false}
          editTitle=""
          editInputRef={editInputRef}
          onToggle={() => {}}
          onDelete={() => {}}
          onEditStart={() => {}}
          onEditChange={() => {}}
          onEditSubmit={() => {}}
          onEditKeyUp={() => {}}
        />
      )}
    </section>
  );
};
