import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  handleDeleteTodo: (value: number) => void;
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: number[];
  handleLoading: (value: number[]) => void;
  handleUpdateTodo: (todo: Todo, title: string) => void;
  handleToggleChange: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  handleDeleteTodo,
  visibleTodos,
  tempTodo,
  isLoading,
  handleLoading,
  handleUpdateTodo,
  handleToggleChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          todo={todo}
          onTodoDelete={handleDeleteTodo}
          isLoading={isLoading}
          handleLoading={handleLoading}
          key={todo.id}
          onTodoUpdate={handleUpdateTodo}
          onToggleChange={handleToggleChange}
        />
      ))}

      {(tempTodo) && (
        <TodoItem
          todo={tempTodo}
          onTodoDelete={handleDeleteTodo}
          isLoading={isLoading}
          handleLoading={handleLoading}
          onTodoUpdate={handleUpdateTodo}
          onToggleChange={handleToggleChange}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
