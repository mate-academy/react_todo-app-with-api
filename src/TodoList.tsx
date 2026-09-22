import React from 'react';

import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  editingTodoId: number | null;
  editTitle: string;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onStartEditing: (todo: Todo) => void;
  onEditTitleChange: (value: string) => void;
  onSubmitEdit: () => void;
  onCancelEdit: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  editingTodoId,
  editTitle,
  onDelete,
  onToggle,
  onStartEditing,
  onEditTitleChange,
  onSubmitEdit,
  onCancelEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isDeleting={deletingTodoIds.includes(todo.id)}
          isUpdating={updatingTodoIds.includes(todo.id)}
          isEditing={editingTodoId === todo.id}
          isTemp={false}
          editTitle={editTitle}
          onDelete={onDelete}
          onToggle={onToggle}
          onStartEditing={onStartEditing}
          onEditTitleChange={onEditTitleChange}
          onSubmitEdit={onSubmitEdit}
          onCancelEdit={onCancelEdit}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isDeleting={false}
          isUpdating={false}
          isEditing={false}
          isTemp
          editTitle=""
          onDelete={() => {}}
          onToggle={() => {}}
          onStartEditing={() => {}}
          onEditTitleChange={() => {}}
          onSubmitEdit={() => {}}
          onCancelEdit={() => {}}
        />
      )}
    </section>
  );
};
