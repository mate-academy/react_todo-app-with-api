import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  editingTodoId: number | null;
  todoToChange: number[];
  handleEditTodo: (id: number) => void;
  handleFormSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    id: number,
    oldTitle: string,
  ) => void;
  handleSaveTodo: (id: number, newTitle: string, oldTitle: string) => void;
  handleEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleUpdateTodo: (id: number, data: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  editingTodoId,
  todoToChange,
  handleEditTodo,
  handleFormSubmit,
  handleSaveTodo,
  handleEditKeyDown,
  handleUpdateTodo,
  deleteTodo,
  editInputRef,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        editingTodoId={editingTodoId}
        todoToChange={todoToChange}
        handleEditTodo={handleEditTodo}
        handleFormSubmit={handleFormSubmit}
        handleSaveTodo={handleSaveTodo}
        handleEditKeyDown={handleEditKeyDown}
        handleUpdateTodo={handleUpdateTodo}
        deleteTodo={deleteTodo}
        editInputRef={editInputRef}
      />
    ))}
  </section>
);
