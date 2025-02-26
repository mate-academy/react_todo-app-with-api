import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from '../components/TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  loadingTodoId: number | null;
  onToggleComplete: (todo: Todo) => void;
  onSave: (id: number, title: string) => Promise<void>;
  onError: (message: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  loadingTodoId,
  onToggleComplete,
  onSave,
  onError,
}) => (
  <>
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        isUpdating={loadingTodoId === todo.id}
        onToggleComplete={onToggleComplete}
        onSave={onSave}
        onError={onError}
      />
    ))}
  </>
);
