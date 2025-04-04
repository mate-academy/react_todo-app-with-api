import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todoId: number, updates: Partial<Todo>) => Promise<void>;
  loadingTodoIds: number[];
  onAddTodo: (title: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onUpdateTodo,
  loadingTodoIds,
}) => {
  const handleUpdateTodo = async (todoId: number, updates: Partial<Todo>) => {
    try {
      await onUpdateTodo(todoId, updates);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          onUpdate={handleUpdateTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          isAdding={false}
          isUpdatingStatus={loadingTodoIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDeleteTodo}
          onUpdate={handleUpdateTodo}
          isLoading={true}
          isAdding={true}
          isUpdatingStatus={true}
        />
      )}
    </section>
  );
};
