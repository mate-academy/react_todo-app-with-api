import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  filteredTodos: Todo[];
  isAdding: boolean;
  isLoading: boolean;
  tempTodo: Todo | null;
  deletingIds: number[];
  onDeleteTodo: (todoId: number) => void;
  updatingIds: number[];
  onToggleTodo: (todo: Todo) => void;
  onUpdateTitle: (todo: Todo, newTitle: string, onFinish: () => void) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  isAdding,
  isLoading,
  tempTodo,
  deletingIds,
  onDeleteTodo,
  updatingIds,
  onToggleTodo,
  onUpdateTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading}
          isDeleting={deletingIds.includes(todo.id)}
          onDelete={onDeleteTodo}
          isUpdating={updatingIds.includes(todo.id)}
          onToggle={onToggleTodo}
          onUpdateTitle={onUpdateTitle}
        />
      ))}

      {/* This todo is in loadind state */}
      {isAdding && tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isLoading={isAdding}
          isDeleting={false}
          onDelete={onDeleteTodo}
          isUpdating={false}
          onToggle={onToggleTodo}
          onUpdateTitle={onUpdateTitle}
        />
      )}
    </section>
  );
};
