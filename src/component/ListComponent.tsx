/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { TodoItem } from './Todo';
import { Todo } from '../types/Type';

type Props = {
  todos: Todo[];
  handleDelete: (id: number) => void;
  isLoadingTodos: number[];
  isLoading: boolean;
  tempTodo: Todo | null;
  updateCompleted: (id: number, completed: boolean) => void;
  updateTitle: (id: number, newTitle: string) => Promise<Todo>;
};

export const ListComponent: React.FC<Props> = ({
  todos,
  handleDelete,
  isLoadingTodos,
  isLoading,
  tempTodo,
  updateCompleted,
  updateTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          isProcessing={isLoadingTodos.includes(todo.id)}
          updateCompleted={updateCompleted}
          updateTitle={updateTitle}
          todos={todos}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDelete={handleDelete}
          isProcessing={isLoading}
        />
      )}
    </section>
  );
};
