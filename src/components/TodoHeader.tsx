/* eslint-disable jsx-a11y/control-has-associated-label */

import {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../types/enum';
import { GlobalContext } from '../TodoContext';

export const TodoHeader: React.FC = () => {
  const {
    setTempTodo,
    setError,
    tempTodo,
    error,
    handleCheckAll,
    state,
  } = useContext(GlobalContext);

  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      setIsInputDisabled(true);

      setTempTodo({
        title: inputValue.trim(),
        id: 0,
        completed: false,
        userId: 82,
      });
    } else if (event.key === 'Enter' && !inputValue.trim()) {
      event.preventDefault();
      setError(ErrorMessages.EmptyInputFail);
    }
  };

  if (!tempTodo && isInputDisabled) {
    if (!error) {
      setInputValue('');
    } else {
      setInputValue(prev => prev);
    }

    setIsInputDisabled(false);
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputValue, error]);

  const toggleFlag = state.todos
    .filter(todo => todo.completed).length === state.todos.length;

  return (
    <header className="todoapp__header">
      {!!state.todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: toggleFlag })}
          data-cy="ToggleAllButton"
          onClick={handleCheckAll}
        />
      )}

      <form>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onKeyDown={handleKeyPress}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
