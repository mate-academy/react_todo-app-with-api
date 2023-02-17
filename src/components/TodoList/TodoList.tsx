import React from 'react';
import { ErrorMessages } from '../../types/ErrorMessages';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[],
  onDeleteTodo: (todo: Todo) => void;
  handleUpdateTodoStatus: (todo: Todo) => void,
  isUpdatingTodoId: number,
  handleUpdateTodoTitle: (todo: Todo, newTitle: string) => void,
  setIsError: (value: boolean) => void,
  setErrorMessage: (value: ErrorMessages) => void,
};

export const TodoList:React.FC<Props> = ({
  todos,
  onDeleteTodo,
  handleUpdateTodoStatus,
  isUpdatingTodoId,
  handleUpdateTodoTitle,
  setIsError,
  setErrorMessage,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        handleUpdateTodoStatus={handleUpdateTodoStatus}
        isUpdatingTodoId={isUpdatingTodoId}
        handleUpdateTodoTitle={handleUpdateTodoTitle}
        setIsError={setIsError}
        setErrorMessage={setErrorMessage}
      />
    ))}
  </section>
);
