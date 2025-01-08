import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  loadingTodoId: number | null;
  updateTodo: (todoId: number, updatedFields: Partial<Todo>) => Promise<Todo>;
  setError: (error: string | null) => void;
  error: string | null;
  toggleTodo: (todoId: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  deleteTodo,
  loadingTodoId,
  updateTodo,
  setError,
  error,
  toggleTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          loadingTodoId={loadingTodoId}
          updateTodo={updateTodo}
          setError={setError}
          error={error}
        />
      ))}
    </section>
  );
};
