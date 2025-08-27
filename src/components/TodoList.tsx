import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  filteredTodos: Todo[];
  onChange: (id: number, data: { completed: boolean }) => Promise<void>;
  handleDeleteTodo: (id: number) => Promise<void>;
  handleEditTodo: (id: number, newTitle: string) => Promise<boolean>;
  tempTodo: Todo | null;
  loadingTodos: number[];
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
};

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  onChange,
  handleDeleteTodo,
  handleEditTodo,
  tempTodo,
  loadingTodos,
  inputRef,
  isLoading,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onChange={onChange}
          handleDeleteTodo={handleDeleteTodo}
          handleEditTodo={handleEditTodo}
          inputRef={inputRef}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          onChange={onChange}
          handleDeleteTodo={handleDeleteTodo}
          inputRef={inputRef}
          isLoading={isLoading}
          handleEditTodo={handleEditTodo}
        />
      )}
    </section>
  );
};
