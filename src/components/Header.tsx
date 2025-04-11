import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { SubmitForm } from './SubmitForm';

type Props = {
  todos: Todo[];
  handleChangeTodos: () => void;
  handleAddTodo: (newTodo: Todo) => void;
  setInputValue: (inputValue: string) => void;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  handleChangeTodos,
  handleAddTodo,
  setInputValue,
  inputValue,
  inputRef,
}: Props) => {
  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every((todo: Todo) => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleChangeTodos}
        />
      )}
      <SubmitForm
        handleAddTodo={handleAddTodo}
        inputRef={inputRef}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </header>
  );
};
