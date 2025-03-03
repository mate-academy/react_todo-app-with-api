import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoSectionProps {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  handleStatusTodo: (todo: Todo) => void;
  loading: boolean;
  handleUpdateTodo: (todo: Todo, newTitle: string) => Promise<Todo | null>;
  setError: (error: string | null) => void;
  isToggleAll: boolean;
  processingIds: number[];
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  todos,
  handleDeleteTodo,
  tempTodo,
  handleStatusTodo,
  loading,
  handleUpdateTodo,
  setError,
  isToggleAll,
  processingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          handleStatusTodo={handleStatusTodo}
          loading={loading}
          handleUpdateTodo={handleUpdateTodo}
          setError={setError}
          isToggleAll={isToggleAll}
          processingIds={processingIds}
        />
      ))}
      {tempTodo && (
        <TodoItem
          handleUpdateTodo={handleUpdateTodo}
          handleStatusTodo={handleStatusTodo}
          todo={tempTodo}
          key={tempTodo.id}
          handleDeleteTodo={handleDeleteTodo}
          loading
          setError={setError}
          isToggleAll={isToggleAll}
          processingIds={processingIds}
        />
      )}
    </section>
  );
};
