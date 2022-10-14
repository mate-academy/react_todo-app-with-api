/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState } from 'react';
import { addTodo } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { User } from '../../types/User';

interface Props {
  changeError: (value: ErrorTypes | null) => void;
  isAdding: boolean;
  changeIsAdding: (value: boolean) => void;
  user: User;
  add: (todo: any) => void | PromiseLike<void>;
  allActive: boolean;
  toggleAll: () => void;
}

const TodoHeader: React.FC<Props> = (
  {
    changeError,
    isAdding,
    changeIsAdding,
    user,
    add,
    allActive,
    toggleAll,
  },
) => {
  const [inputValue, setInputValue] = useState<string>('');

  const changeInputValue = (value: string) => {
    setInputValue(value);
  };

  const submitForm = () => {
    changeIsAdding(true);

    if (!inputValue) {
      changeError(ErrorTypes.Empty);
      changeIsAdding(false);

      return;
    }

    const newTodo = {
      userId: user.id,
      title: inputValue,
      completed: false,
    };

    addTodo(newTodo)
      .then(add)
      .then(() => changeInputValue(''))
      .catch(() => changeError(ErrorTypes.Add))
      .finally(() => changeIsAdding(false));
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all', { active: allActive },
        )}
        onClick={toggleAll}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        submitForm();
      }}
      >
        <input
          id="input"
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          value={inputValue}
          onChange={event => {
            changeInputValue(event.target.value);
          }}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

export default TodoHeader;
