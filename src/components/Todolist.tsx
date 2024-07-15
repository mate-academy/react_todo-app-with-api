/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';

import { ErrorMessages } from '../types/ErrorMessages';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: (message: ErrorMessages) => void;

  handleCompletedTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
};

export const List: React.FC<Props> = ({
  todos,
  tempTodo,

  loadingTodoIds,
  handleCompletedTodo,
  setLoadingTodoIds,
  setLoading,
  deleteTodo,
  setErrorMessage,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingIds={loadingTodoIds}
          handleCompletedTodo={handleCompletedTodo}
          setLoadingTodoIds={setLoadingTodoIds}
          deleteTodo={deleteTodo}
          setErrorMessage={setErrorMessage}
          updateTodoTitle={updateTodoTitle}
          setLoading={setLoading}
        />
      ))}
      {tempTodo && (
        <TempTodo
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          deleteTodo={deleteTodo}
          handleCompletedTodo={handleCompletedTodo}
        />
      )}
    </section>
  );
};
