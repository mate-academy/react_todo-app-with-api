/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { NotificationText } from '../../types/enums';
import { USER_ID } from '../../utils/user';
import * as todosService from '../../api/todos';

import { Todo } from '../../types/Todo';

interface Props {
  isAllItemsAreCompleted: boolean;
  showError: (errorMessage: NotificationText) => void;
  setNewTodo: (todo: Todo) => void;
  setTempTodo: (todo: Todo | null) => void;
  toggleAll: () => void;
}

export const Header: React.FC<Props> = React.memo(({
  isAllItemsAreCompleted,
  setNewTodo,
  showError,
  setTempTodo,
  toggleAll,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.style.outline = 'none';
    }
  });

  function reset() {
    setInputValue('');
    setIsInputDisabled(false);
    setTempTodo(null);
  }

  const addNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      showError(NotificationText.InputIsEmpty);

      return;
    }

    const tempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    setTempTodo(tempTodo);
    setIsInputDisabled(true);

    todosService.addTodo(inputValue, false)
      .then(setNewTodo)
      .catch((error) => {
        showError(NotificationText.Add);
        setTempTodo(null);
        throw error;
      })
      .finally(() => {
        reset();
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllItemsAreCompleted,
        })}
        onClick={toggleAll}
      />

      <form onSubmit={addNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          ref={inputRef}
          onChange={input => setInputValue(input.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
});
