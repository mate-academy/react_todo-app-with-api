import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

interface Props {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  editingTodoId: number | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  setEditingTodoId: (id: number | null) => void;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo) => void;
  mainInputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  editingTodoId,
  editTitle,
  setEditTitle,
  setEditingTodoId,
  onDelete,
  onToggle,
  onRename,
  mainInputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          isUpdating={updatingTodoIds.includes(todo.id)}
          editingTodoId={editingTodoId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          setEditingTodoId={setEditingTodoId}
          onDelete={onDelete}
          onToggle={onToggle}
          onRename={onRename}
          mainInputRef={mainInputRef}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isTemp
          isDeleting={false}
          isUpdating={false}
          editingTodoId={null}
          editTitle=""
          setEditTitle={() => {}}
          setEditingTodoId={() => {}}
          onDelete={() => {}}
          onToggle={() => {}}
          onRename={() => {}}
          mainInputRef={mainInputRef}
        />
      )}
    </section>
  );
};
