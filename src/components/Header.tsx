import React from 'react';
import { ToDoForm } from './ToDoForm';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  addToDo: (todo: Todo) => Promise<void>;
  setErrorMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  addToDo,
  setErrorMessage,
  inputRef,
  todos,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <ToDoForm
        onSubmit={addToDo}
        onError={setErrorMessage}
        inputRef={inputRef}
      />
    </header>
  );
};
