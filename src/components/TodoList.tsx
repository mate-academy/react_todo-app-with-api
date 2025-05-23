import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  editingTodoId: number | null;
  editingTitle: string;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onEditStart: (todo: Todo) => void;
  onEditChange: (value: string) => void;
  onEditConfirm: (todo: Todo) => void;
  onEditCancel: () => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  editingTodoId,
  editingTitle,
  loadingTodoIds,
  tempTodo,
  onToggle,
  onDelete,
  onEditStart,
  onEditChange,
  onEditConfirm,
  onEditCancel,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={loadingTodoIds.includes(todo.id)}
        isEditing={editingTodoId === todo.id}
        editingTitle={editingTitle}
        onToggle={() => onToggle(todo)}
        onDelete={() => onDelete(todo)}
        onDoubleClick={() => onEditStart(todo)}
        onChangeTitle={onEditChange}
        onBlur={() => onEditConfirm(todo)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEditConfirm(todo);
          } else if (e.key === 'Escape') {
            onEditCancel();
          }
        }}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key="temp"
        todo={tempTodo}
        isLoading={true}
        isEditing={false}
        editingTitle=""
        onToggle={() => {}}
        onDelete={() => {}}
        onDoubleClick={() => {}}
        onChangeTitle={() => {}}
        onBlur={() => {}}
        onKeyDown={() => {}}
      />
    )}
  </section>
);
