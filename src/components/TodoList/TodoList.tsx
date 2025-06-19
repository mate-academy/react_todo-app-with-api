import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodoServiceErrorsValues } from '../../types/Errors';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  onSubmit: (value: Todo, shouldRefocus?: boolean) => Promise<void>;
  todosInProgress: number[];
  setErrorMessage: (error: TodoServiceErrorsValues | null) => void;
}

/* eslint-disable jsx-a11y/label-has-associated-control */
export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  onSubmit,
  todosInProgress,
  setErrorMessage,
}) => {
  const getTodoLoadingState = (todoId: number): boolean => {
    return Boolean(todosInProgress?.includes(todoId));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          onSubmit={onSubmit}
          isLoading={getTodoLoadingState(todo.id)}
          setErrorMessage={setErrorMessage}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          onSubmit={onSubmit}
          isLoading={true}
          setErrorMessage={setErrorMessage}
        />
      )}
    </section>
  );
};
