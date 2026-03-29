import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  deletingIds: Set<number>;
  onDelete: (todoId: number) => void;
  updatingIds: Set<number>;
  onToggle: (todoId: number) => void;
  editingTodoId: number | null;
  onStartEdit: (todoId: number) => void;
  onCancelEdit: () => void;
  onSubmitTitle: (todoId: number, title: string) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  tempTodo,
  deletingIds,
  onDelete,
  updatingIds,
  onToggle,
  editingTodoId,
  onStartEdit,
  onCancelEdit,
  onSubmitTitle,
}) => {
  const hasAnyTodos = visibleTodos.length > 0 || tempTodo;

  if (!hasAnyTodos) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={deletingIds.has(todo.id) || updatingIds.has(todo.id)}
          onDelete={onDelete}
          onToggle={onToggle}
          isEditing={editingTodoId === todo.id}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSubmitTitle={onSubmitTitle}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isLoading isDeleteDisabled />}
    </section>
  );
};
