import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  isLoading: boolean;
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  onToggle: (todoId: number) => void;
  onUpdate: (todoId: number, updatedFields: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDeleteTodo,
  onToggle,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDeleteTodo}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={{ ...tempTodo, isLoading: true }}
          onDelete={handleDeleteTodo}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      )}
    </section>
  );
};
