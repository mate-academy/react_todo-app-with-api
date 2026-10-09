import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  editingTodoId: number | null;
  editingTitle: string;
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  onStartEditing: (todo: Todo) => void;
  onEditingTitleChange: (title: string) => void;
  onSaveEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  editingTodoId,
  editingTitle,
  onDelete,
  onToggle,
  onStartEditing,
  onEditingTitleChange,
  onSaveEditing,
  onCancelEditing,
}) => {
  const itemCallbacks = {
    onDelete,
    onToggle,
    onStartEditing,
    onEditingTitleChange,
    onSaveEditing,
    onCancelEditing,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={
            deletingTodoIds.includes(todo.id) ||
            updatingTodoIds.includes(todo.id)
          }
          isEditing={editingTodoId === todo.id}
          editingTitle={editingTitle}
          {...itemCallbacks}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          isTemporary
          isEditing={false}
          editingTitle=""
          {...itemCallbacks}
        />
      )}
    </section>
  );
};
