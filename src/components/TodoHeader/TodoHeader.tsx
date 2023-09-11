/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTodo } from '../TodoContext/TodoContext';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    todosUncompleted,
    toogleAll,
    addTodo,
    isOnAdd,
    inputValue,
    setInputValue,
    handleAddTodoError,
    resetError,
    isError,
  } = useTodo();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputOnFocus, setInputOnFocus] = useState(false);
  let timeoutId: NodeJS.Timeout | null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputOnFocus(true);
  };

  const handleTodoAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      handleAddTodoError("Title can't be empty");
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        resetError();
      }, 3000);
    } else {
      addTodo(inputValue);
    }
  };

  useEffect(() => {
    if (isError.isError && inputValue.trim() !== '') {
      resetError();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }, [inputValue, isError, resetError]);

  useEffect(() => {
    if (inputOnFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, inputOnFocus, inputRef.current]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !todosUncompleted },
          )}
          title="Togle All"
          onClick={toogleAll}
        />
      )}

      <form onSubmit={handleTodoAdd}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isOnAdd}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
