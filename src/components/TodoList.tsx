import React from 'react';
import { FILTERS } from '../constants';
import type { FilterStatus, Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  filter: FilterStatus;
  loadingTodoIds: number[];
  editingTodoId: number | null;
  editingTitle: string;
  onDeleteTodo: (todoId: number) => Promise<boolean>;
  onToggleTodo: (todo: Todo) => Promise<void>;
  onStartEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
  onEditingTitleChange: (title: string) => void;
  onSubmitEditing: (todo: Todo) => Promise<boolean>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  filter,
  loadingTodoIds,
  editingTodoId,
  editingTitle,
  onDeleteTodo,
  onToggleTodo,
  onStartEditing,
  onCancelEditing,
  onEditingTitleChange,
  onSubmitEditing,
}) => {
  const shouldShowTempTodo = tempTodo !== null && filter !== FILTERS.COMPLETED;

  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingTodoIds.includes(todo.id)}
          isEditing={editingTodoId === todo.id}
          editingTitle={editingTitle}
          onDeleteTodo={onDeleteTodo}
          onToggleTodo={onToggleTodo}
          onStartEditing={onStartEditing}
          onCancelEditing={onCancelEditing}
          onEditingTitleChange={onEditingTitleChange}
          onSubmitEditing={onSubmitEditing}
        />
      ))}

      {shouldShowTempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading
          isEditing={false}
          editingTitle=""
          isTemp
          onDeleteTodo={onDeleteTodo}
          onToggleTodo={onToggleTodo}
          onStartEditing={onStartEditing}
          onCancelEditing={onCancelEditing}
          onEditingTitleChange={onEditingTitleChange}
          onSubmitEditing={onSubmitEditing}
        />
      )}
    </>
  );
};
